<script>
	// Background for the homepage header, after the old site's banner video. Two kinds of growth, both kept clear of
	// a rounded blob around `exclude` (the header text):
	//  - dot clouds: dots appear next to existing ones and push apart into an evenly packed field;
	//  - lines: a moving head (a dot) steers smoothly through free space, leaving a curved trail whose thickness
	//    swells and thins; heads stop when boxed in, and new heads occasionally bud off the side of a line.
	// Everything keeps drifting gently once grown.
	import { onMount } from 'svelte';

	let { exclude = null } = $props();

	let canvas;
	let paused = $state(false);
	let reduced = $state(false);
	let fast = $state(false); // fast-forwarding to the finished state
	let done = $state(false); // growth has finished; only the gentle drift remains
	let sync = () => {}; // restarts or stops the animation loop; set once mounted
	let watch = () => {}; // starts tracking the text element's size; set once mounted

	// the text element is bound by the parent after this component mounts, so pick it up when it arrives
	$effect(() => {
		if (exclude) watch(exclude);
	});

	const SPACING = 15; // resting distance between neighbours, px
	const DOT = 1.5; // dot radius, px
	const PAD = 8; // extra margin around the text before the blob is drawn round it, px
	const SEG = 5; // a line drops a trail point every SEG px
	const SPEED = 1.0; // line head speed, px per frame
	const HEADS = 10; // line heads kept growing at once (new branches replace heads that stop)
	const CLOUD_LEAD = 1.25; // dot clouds cover this many times the area lines cover per frame
	// solid grey (the look of the ink at ~55% on white): line pieces overlap at their joins, and a see-through
	// colour would darken there and make the lines look beaded
	const INK = 'rgb(141 141 142)';

	onMount(() => {
		const ctx = canvas.getContext('2d');
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		let w = 0, h = 0, blob = null, cloudTarget = 0, trailBudget = 0, trail = 0, raf = 0, visible = true, grid = new Map();
		let dots = []; // everything that takes part in spacing: cloud dots and line trail points
		let clouds = []; // each dot cloud's own dots, oldest first
		let lines = []; // { pts, head, dir, turn, alive, blocked, grace, parent, phase/freq for thickness }
		// growth runs at a steady pace until this share of the free area is covered, then tapers off
		const slowAt = 0.6 + Math.random() * 0.15;
		let cloudCredit = 0; // fractional cloud dots owed, so clouds can grow at a steady sub-1-dot-per-frame rate
		let lineRate = 0; // smoothed area the lines actually add per frame (at full pace), which the clouds track

		// clear area around the text: a rounded, lumpy blob (a squircle with a few random bulges, new each load).
		// The squircle is scaled up enough to always cover the text's corners; bulges only push it further out.
		const wobble = [2, 3, 4, 5].map((k) => ({ k, amp: 1 / k, phase: Math.random() * Math.PI * 2 }));
		const norm = wobble.reduce((s, o) => s + o.amp, 0);
		const reach = (t) => 1 + 0.18 * (wobble.reduce((s, o) => s + o.amp * Math.sin(o.k * t + o.phase), 0) / norm + 1) / 2;
		function blobFn(x, y) {
			// r < 1 inside the blob; dx/dy give the outward direction
			const dx = (x - blob.cx) / blob.a, dy = (y - blob.cy) / blob.b;
			const r = (dx ** 4 + dy ** 4) ** 0.25;
			return { r: r / reach(Math.atan2(dy, dx)), dx, dy };
		}
		const inBlob = (x, y) => blob && blobFn(x, y).r < 1;
		const inside = (x, y) => x > 2 && x < w - 2 && y > 2 && y < h - 2 && !inBlob(x, y);

		function measure() {
			const r = canvas.getBoundingClientRect();
			const sx = w ? r.width / w : 1, sy = h ? r.height / h : 1;
			w = r.width; h = r.height;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			for (const d of dots) { d.x *= sx; d.y *= sy; }
			for (const l of lines) { l.head.x *= sx; l.head.y *= sy; }
			const hadBlob = !!blob;
			blob = null;
			if (exclude) {
				const e = exclude.getBoundingClientRect();
				blob = {
					cx: (e.left + e.right) / 2 - r.left, cy: (e.top + e.bottom) / 2 - r.top,
					a: (e.width / 2 + PAD) * 1.2, b: (e.height / 2 + PAD) * 1.2
				};
			}
			// the text element arrives a moment after mount: when it first does, start over so the seeds are planted
			// around it (seeds planted before it was known could sit where the text is and be cleared away)
			if (blob && !hadBlob) { dots = []; lines = []; clouds = []; }
			// keep the text clear immediately, even in the still version
			dots = dots.filter((d) => !inBlob(d.x, d.y));
			const kept = new Set(dots);
			for (const l of lines) {
				l.pts = l.pts.filter((p) => kept.has(p));
				l.pts.forEach((p, i) => { if (p.line === l) p.i = i; });
				if (l.alive && inBlob(l.head.x, l.head.y)) l.alive = false;
			}
			lines = lines.filter((l) => l.pts.length);
			clouds = clouds.map((c) => c.filter((d) => kept.has(d))).filter((c) => c.length);
			cloudTarget = Math.max(0, Math.floor((w * h - (blob ? 3.6 * blob.a * blob.b : 0)) / (SPACING * SPACING * 0.95)));
			// lines may cover roughly a third of the free area (a trail has SPACING/SEG points per cloud-dot's worth of space)
			trailBudget = Math.floor(cloudTarget * 0.5 * (SPACING / SEG)); // lines may take up to about half the space
			trail = dots.filter((d) => d.line).length;
			if (!dots.length && w && h) seed(); // first run, or everything was cleared
		}

		// ---------- line trails ----------
		function addPoint(l, x, y) {
			const i = l.pts.length;
			// thickness swells and thins along the line: two slow waves multiplied together
			const wave = (0.5 + 0.5 * Math.sin(l.phase + i * l.freq)) * (0.55 + 0.45 * Math.sin(l.phase2 + i * l.freq2));
			const p = { x, y, vx: 0, vy: 0, line: l, i, w: 0.5 + 2.1 * wave };
			l.pts.push(p);
			dots.push(p);
			trail++;
		}
		function newLine(x, y, dir, from = null) {
			const l = {
				pts: [], head: { x, y }, dir, turn: 0, alive: true, blocked: 0,
				grace: from ? 30 : 0, parent: from?.line ?? null,
				// how many cloud dots it can push aside before giving up: random, mostly modest, occasionally large
				stamina: -Math.log(1 - Math.random()) * 120,
				// progress check: where the head was at the last check, and how far it has travelled since
				anchor: { x, y }, travelled: 0,
				phase: Math.random() * 6.3, freq: 0.04 + Math.random() * 0.06,
				phase2: Math.random() * 6.3, freq2: 0.01 + Math.random() * 0.02
			};
			if (from) l.pts.push(from); else addPoint(l, x, y);
			lines.push(l);
		}
		// neighbours a line's head doesn't steer around: cloud dots (it pushes through those instead), its own recent
		// trail, and its parent line just after budding
		const ignore = (l, o) => !o.line || (o.line === l && o.i > l.pts.length - 10) || (l.grace > 0 && o.line === l.parent);
		function near(x, y, radius, fn) {
			const cx = Math.floor(x / SPACING), cy = Math.floor(y / SPACING), reach2 = Math.ceil(radius / SPACING);
			for (let i = -reach2; i <= reach2; i++)
				for (let j = -reach2; j <= reach2; j++)
					for (const o of grid.get((cx + i) * 100003 + cy + j) ?? []) fn(o);
		}
		function roomAhead(l, x, y) {
			if (!inside(x, y)) return false;
			let ok = true;
			near(x, y, SPACING, (o) => {
				if (ok && !ignore(l, o) && (o.x - x) ** 2 + (o.y - y) ** 2 < (SPACING * 0.6) ** 2) ok = false;
			});
			return ok;
		}
		function moveHeads(speed) {
			for (const l of lines) {
				if (!l.alive) continue;
				if (trail >= trailBudget || l.pts.length > 400) { l.alive = false; continue; } // enough line for now
				if (l.grace > 0) l.grace--;
				const hd = l.head;
				// steer away from whatever is close, plus a slowly wandering turn
				let rx = 0, ry = 0;
				near(hd.x, hd.y, SPACING * 1.4, (o) => {
					if (ignore(l, o)) return;
					const dx = hd.x - o.x, dy = hd.y - o.y, dist = Math.hypot(dx, dy) || 0.01;
					if (dist < SPACING * 1.4) { const f = 1 - dist / (SPACING * 1.4); rx += (dx / dist) * f; ry += (dy / dist) * f; }
				});
				if (rx || ry) {
					let diff = Math.atan2(ry, rx) - l.dir;
					diff = Math.atan2(Math.sin(diff), Math.cos(diff));
					l.dir += diff * Math.min(0.06, Math.hypot(rx, ry) * 0.05);
				}
				l.turn = l.turn * 0.96 + (Math.random() - 0.5) * 0.01;
				l.dir += l.turn;
				const nx = hd.x + Math.cos(l.dir) * speed, ny = hd.y + Math.sin(l.dir) * speed;
				if (!roomAhead(l, nx, ny)) {
					// boxed in: try turning for a while, then stop and leave the head as the line's end dot
					l.dir += (l.turn >= 0 ? 1 : -1) * 0.12;
					if (++l.blocked > 60) l.alive = false;
					continue;
				}
				l.blocked = 0;
				hd.x = nx; hd.y = ny;
				// part the cloud dots around the head; each one pushed aside uses up some of the line's stamina
				let pushed = 0;
				near(hd.x, hd.y, SPACING * 1.3, (o) => {
					if (o.line) return;
					const dx = o.x - hd.x, dy = o.y - hd.y, dist = Math.hypot(dx, dy) || 0.01;
					if (dist < SPACING * 1.3) { const f = (1 - dist / (SPACING * 1.3)) * 0.8; o.vx += (dx / dist) * f; o.vy += (dy / dist) * f; pushed++; }
				});
				l.stamina -= pushed * (speed / SPEED);
				if (l.stamina <= 0) { l.alive = false; continue; }
				// trapped: over the last stretch it has circled or crawled in a small pocket instead of getting anywhere
				l.travelled += speed;
				if (l.travelled >= 90) {
					if (Math.hypot(hd.x - l.anchor.x, hd.y - l.anchor.y) < l.travelled * 0.3) { l.alive = false; continue; }
					l.anchor = { x: hd.x, y: hd.y }; l.travelled = 0;
				}
				const last = l.pts[l.pts.length - 1];
				if (Math.hypot(hd.x - last.x, hd.y - last.y) >= SEG) addPoint(l, hd.x, hd.y);
			}
			// replace heads that have stopped: a new head buds off the side of an existing line
			const alive = lines.filter((l) => l.alive).length;
			if (alive < HEADS && trail < trailBudget && covered() < 0.9 && Math.random() < 0.15 * (speed / SPEED)) {
				// try a dozen spots along existing lines and bud from the one facing the most open space
				let best = null;
				for (let t = 0; t < 12; t++) {
					const l = lines[(Math.random() * lines.length) | 0];
					if (l.pts.length <= 30) continue;
					const k = 10 + ((Math.random() * (l.pts.length - 20)) | 0);
					const a = l.pts[k - 1], b = l.pts[k + 1], p = l.pts[k];
					const dir = Math.atan2(b.y - a.y, b.x - a.x) + ((Math.random() < 0.5 ? 1 : -1) * Math.PI) / 2.5;
					// how crowded it is a little way out in that direction (dots and lines both count)
					const R = SPACING * 2, px = p.x + Math.cos(dir) * R, py = p.y + Math.sin(dir) * R;
					if (!inside(px, py)) continue;
					let crowd = 0;
					near(px, py, R, (o) => { if ((o.x - px) ** 2 + (o.y - py) ** 2 < R * R) crowd++; });
					if (!best || crowd < best.crowd) best = { p, dir, crowd };
				}
				if (best) newLine(best.p.x, best.p.y, best.dir, best.p);
			}
		}

		// ---------- dot clouds ----------
		function seed() {
			// a random free spot with x between x0 and x1 (fractions of the width), between `min` and `max` px from `from`
			const spot = (x0, x1, from = null, min = 0, max = Infinity) => {
				for (let t = 0; t < 300; t++) {
					const x = (x0 + Math.random() * (x1 - x0)) * w, y = (0.15 + Math.random() * 0.7) * h;
					const d = from ? Math.hypot(from.x - x, from.y - y) : min;
					if (inside(x, y) && d >= min && d <= max) return { x, y };
				}
			};
			// two lines always start on opposite sides, heading roughly up or down into open space
			const starts = [spot(0.03, 0.2), spot(0.8, 0.97)].filter(Boolean);
			for (const s of starts) newLine(s.x, s.y, (Math.random() < 0.5 ? -1 : 1) * Math.PI / 2 + (Math.random() - 0.5));
			// two dot clouds about a third of the width apart (where the lines start doesn't matter). If there's no free
			// spot at that distance, widen the allowed range step by step rather than dropping the second cloud.
			const first = spot(0, 1);
			let second;
			for (let slack = 0.15; first && !second && slack < 3; slack += 0.25)
				second = spot(0, 1, first, (w / 3) * (1 - slack), (w / 3) * (1 + slack));
			for (const c of [first, second]) if (c) { const d = { x: c.x, y: c.y, vx: 0, vy: 0 }; dots.push(d); clouds.push([d]); }
		}
		function growClouds(rate) {
			// CLOUD_LEAD times the area the lines are actually adding, with a floor so clouds keep growing if lines stall
			const lineArea = Math.max(lineRate, 0.4 * HEADS * SPEED * SPACING);
			cloudCredit = Math.min(8, cloudCredit + ((CLOUD_LEAD * lineArea) / (SPACING * SPACING * 0.95)) * rate);
			const size = clouds.reduce((n, c) => n + c.length, 0);
			const added = []; // not in the neighbour grid until the next physics step
			const clear = (x, y, o) => (o.x - x) ** 2 + (o.y - y) ** 2 > (SPACING * 0.6) ** 2;
			// clouds take turns; each grows from its newest dots, which sit on its edge where there's room
			for (let k = 0; k < 40 && cloudCredit >= 1 && size + added.length < cloudTarget && clouds.length; k++) {
				const cloud = clouds[k % clouds.length];
				const edge = Math.floor(cloud.length * 0.6);
				const p = cloud[edge + ((Math.random() * (cloud.length - edge)) | 0)];
				const a = Math.random() * Math.PI * 2;
				const x = p.x + Math.cos(a) * SPACING, y = p.y + Math.sin(a) * SPACING;
				let ok = inside(x, y) && added.every((o) => clear(x, y, o));
				if (ok) near(x, y, SPACING, (o) => { if (ok && !clear(x, y, o)) ok = false; });
				if (ok) { const d = { x, y, vx: 0, vy: 0 }; added.push(d); dots.push(d); cloud.push(d); cloudCredit--; }
			}
		}

		// ---------- spacing physics ----------
		function step() {
			grid = new Map(); // spatial hash so each point only checks its neighbours
			for (const d of dots) {
				const k = Math.floor(d.x / SPACING) * 100003 + Math.floor(d.y / SPACING);
				(grid.get(k) ?? grid.set(k, []).get(k)).push(d);
			}
			for (const d of dots) {
				near(d.x, d.y, SPACING, (o) => {
					if (o === d) return;
					// points next to each other on the same line keep their own spacing via the trail spring below
					if (d.line && (o.line === d.line && Math.abs(o.i - d.i) < 8 || (d.i < 8 && o === d.line.pts[0]))) return;
					const dx = d.x - o.x, dy = d.y - o.y, dist = Math.hypot(dx, dy) || 0.01;
					if (dist < SPACING) {
						// a trail holds its course: cloud dots move aside fully, but only nudge a trail point a little
						const f = ((SPACING - dist) / SPACING) * 0.35 * (d.line && !o.line ? 0.3 : 1);
						d.vx += (dx / dist) * f; d.vy += (dy / dist) * f;
					}
				});
				if (blob) {
					const b = blobFn(d.x, d.y);
					if (b.r < 1) { const m = Math.hypot(b.dx, b.dy) || 1; d.vx += (b.dx / m) * 0.6; d.vy += (b.dy / m) * 0.6; }
				}
				// trail spring: keep each trail point SEG from the one before it. It pulls both points equally; pulling only
				// the later one lets small wobbles grow down a long line like a whip until the line tears apart.
				if (d.line && d.i > 0) {
					const p = d.line.pts[d.i - 1];
					if (p) {
						const dx = p.x - d.x, dy = p.y - d.y, dist = Math.hypot(dx, dy) || 0.01;
						const f = ((dist - SEG) / dist) * 0.1;
						d.vx += dx * f; d.vy += dy * f;
						p.vx -= dx * f; p.vy -= dy * f;
					}
				}
				d.vx += (Math.random() - 0.5) * 0.05; // gentle drift
				d.vy += (Math.random() - 0.5) * 0.05;
			}
			for (const d of dots) {
				d.vx *= 0.82; d.vy *= 0.82;
				d.x = Math.min(w - 1, Math.max(1, d.x + d.vx));
				d.y = Math.min(h - 1, Math.max(1, d.y + d.vy));
			}
		}

		// ---------- drawing ----------
		function dot(x, y, r) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }
		function draw() {
			ctx.clearRect(0, 0, w, h);
			ctx.strokeStyle = ctx.fillStyle = INK;
			ctx.lineCap = 'round';
			// each line as a smooth curve through its trail (midpoint quadratics), one piece per point so width can vary
			for (const l of lines) {
				const p = l.alive ? [...l.pts, { ...l.head, w: l.pts[l.pts.length - 1].w }] : l.pts;
				if (p.length < 2) continue;
				const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
				for (let k = 0; k < p.length - 1; k++) {
					const from = k === 0 ? p[0] : mid(p[k - 1], p[k]);
					const to = k === p.length - 2 ? p[k + 1] : mid(p[k], p[k + 1]);
					ctx.lineWidth = (p[k].w + p[k + 1].w) / 2;
					ctx.beginPath();
					ctx.moveTo(from.x, from.y);
					ctx.quadraticCurveTo(p[k].x, p[k].y, to.x, to.y);
					ctx.stroke();
				}
			}
			ctx.beginPath();
			for (const d of dots) if (!d.line) dot(d.x, d.y, DOT); // cloud dots
			for (const l of lines) {
				const end = l.alive ? l.head : l.pts[l.pts.length - 1];
				dot(end.x, end.y, DOT * 1.4); // the head, or the dot a stopped line ends in
				if (!l.parent) dot(l.pts[0].x, l.pts[0].y, DOT * 1.4); // and where a line started
			}
			ctx.fill();
		}

		// share of the free area covered by dots and lines (each cloud dot ~ SPACING², each trail point ~ SEG×SPACING)
		const covered = () =>
			((dots.length - trail) * SPACING * SPACING * 0.95 + trail * SEG * SPACING) / Math.max(1, cloudTarget * SPACING * SPACING * 0.95);
		let windowSteps = 0, windowStart = 0; // for spotting when growth has finished
		// one step of growth; `mult` speeds it up (still version, fast-forward)
		function advance(mult) {
			const c = covered();
			const pace = c < slowAt ? 1 : Math.max(0.1, 1 - (c - slowAt) / (1 - slowAt));
			if (c > 0.95) for (const l of lines) l.alive = false; // full: stop lines creeping into the last thin gaps
			const before = trail;
			growClouds(mult * pace); step(); moveHeads(SPEED * mult * pace);
			lineRate = lineRate * 0.97 + (((trail - before) * SEG * SPACING) / (mult * pace)) * 0.03;
			// finished: no line heads left and the clouds have all but stopped (checked over windows of 120 steps)
			if (++windowSteps >= 120) {
				if (!lines.some((l) => l.alive) && dots.length - windowStart < 3) done = true;
				windowSteps = 0; windowStart = dots.length;
			}
		}

		function frame() {
			if (fast && !done) {
				// as many sped-up steps as fit in ~12ms, so the page stays responsive
				const t0 = performance.now();
				do advance(3); while (!done && performance.now() - t0 < 12);
			} else advance(1);
			if (done) fast = false;
			draw();
			raf = requestAnimationFrame(frame);
		}
		const running = () => !paused && visible && !document.hidden && !reduced;
		sync = () => {
			cancelAnimationFrame(raf);
			if (running()) raf = requestAnimationFrame(frame);
		};

		// no motion: grow everything (in bigger steps) and let it settle, then show it as a still image.
		// Capped at ~300ms of work so it never holds up the page.
		const settle = () => {
			const t0 = performance.now();
			for (let i = 0, idle = 0; i < 2500 && idle < 150 && performance.now() - t0 < 300; i++) {
				const n = dots.length;
				advance(3);
				idle = dots.length > n || lines.some((l) => l.alive) ? 0 : idle + 1;
			}
			for (let i = 0; i < 30; i++) step();
		};

		measure();
		if (reduced) { settle(); draw(); } else sync();

		const ro = new ResizeObserver(() => {
			measure();
			if (reduced) settle();
			draw();
		});
		ro.observe(canvas);
		watch = (el) => ro.observe(el);
		if (exclude) watch(exclude);
		const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
		io.observe(canvas);
		document.addEventListener('visibilitychange', sync);
		return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', sync); };
	});

	function toggle() {
		paused = !paused;
		sync();
	}
	function toggleFast() {
		fast = !fast;
		if (fast) paused = false; // fast-forwarding a paused animation should play it
		sync();
	}
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>
{#if !reduced}
	<div class="controls">
		<button
			onclick={toggleFast}
			disabled={done}
			aria-pressed={fast}
			class:on={fast}
			aria-label={done ? 'Background animation has finished growing' : fast ? 'Stop fast-forwarding' : 'Fast-forward background animation'}
			title={done ? 'Finished growing' : 'Fast-forward'}
		>
			<svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M1.5 3v10L8 8zM8 3v10l6.5-5z" fill="currentColor" /></svg>
		</button>
		<button onclick={toggle} aria-label={paused ? 'Play background animation' : 'Pause background animation'}>
			{#if paused}
				<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
			{:else}
				<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>
			{/if}
		</button>
	</div>
{/if}

<style>
	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		/* soft top and bottom edges so the field doesn't butt up against the next section */
		-webkit-mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 82%, transparent);
		mask-image: linear-gradient(to bottom, transparent, #000 12%, #000 82%, transparent);
	}
	.controls {
		position: absolute;
		right: 12px;
		bottom: 12px;
		display: flex;
		gap: 8px;
	}
	.controls button {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: rgb(255 255 255 / 0.85);
		color: var(--ink);
		box-shadow: 0 1px 4px rgb(0 0 0 / 0.15);
		cursor: pointer;
		transition: transform 0.25s cubic-bezier(0.25, 1, 0.5, 1);
	}
	.controls button:active:not(:disabled) {
		transform: scale(0.92);
		transition-duration: 0.1s;
	}
	.controls button.on {
		background: var(--ink);
		color: #fff;
	}
	.controls button:disabled {
		opacity: 0.4;
		cursor: default;
	}
	@media (prefers-reduced-motion: reduce) {
		.controls button {
			transition: none;
		}
	}
	@media (pointer: coarse) {
		.controls button {
			width: 44px;
			height: 44px;
		}
	}
</style>
