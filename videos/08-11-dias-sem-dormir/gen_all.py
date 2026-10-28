import sys, json, subprocess, base64, os, time
from concurrent.futures import ThreadPoolExecutor
K = sys.argv[1]; PM = sys.argv[2]
du = lambda p: 'data:image/jpeg;base64,' + base64.b64encode(open(p, 'rb').read()).decode()
REFS = [du(f'{K}/test/posesheet.jpg'), du(f'{K}/test/exprsheet.jpg')]
STY = ('Black ink hand drawn doodle on plain white paper, thin clean black lines, minimalist explainer video, flat, no shading, no text, no letters, '
       'wide landscape composition with the scene centered and empty white margins on the left and right.')
CHAR = ('Use exactly the stick figure drawing style of the first reference sheet: small perfectly round head, thin single black line body, arms and legs. '
        'Faces use simple expressive cartoon eyes and mouths like the second reference sheet. ')
def call(args):
    body = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "generateImage", "arguments": args}})
    for attempt in range(8):
        r = subprocess.run([PM, body], capture_output=True, text=True).stdout
        i = r.find('https://media.pollinations.ai/')
        if i >= 0: return r[i:].split('"')[0].split('\\')[0]
        time.sleep(20 + attempt * 20)
    raise RuntimeError(r[:300])
ONLY = [int(x) for x in os.environ.get("ONLY","").split(",") if x]
lines = [l.rstrip('\n') for l in open(f'{K}/scenes.txt') if l.strip() and not l.startswith('#') and not l.startswith('CARD')]
def job(i):
    _, a, b = lines[i].split('|')
    fa, fb = f'{K}/img/s{i:02d}a.jpg', f'{K}/img/s{i:02d}b.jpg'
    if not os.path.exists(fa + '.url'):
        try: ua = call({"model": "community/scriptsnsenses-sys/flux-2-dev-free", "size": "1280x720", "seed": 100 + i, "image": REFS, "prompt": CHAR + 'Scene: ' + a + '. ' + STY})
        except Exception: ua = call({"model": "community/scriptsnsenses-sys/flux-2-dev-free", "size": "1280x720", "seed": 100 + i, "image": REFS[0], "prompt": CHAR + 'Scene: ' + a + '. ' + STY})
        subprocess.run(['curl', '-sS', '-m', '120', '-o', fa, ua]); open(fa + '.url', 'w').write(ua)
    ua = open(fa + '.url').read()
    if not os.path.exists(fb + '.url'):
        ub = call({"model": "community/scriptsnsenses-sys/flux-2-dev-free", "size": "1280x720", "seed": 200 + i, "image": ua,
                   "prompt": 'Edit this image: keep exactly the same scene, background, objects, camera framing and drawing style. Only change the pose and facial expression of the characters: ' + b + '.'})
        subprocess.run(['curl', '-sS', '-m', '120', '-o', fb, ub]); open(fb + '.url', 'w').write(ub)
    print('done', i, flush=True)
with ThreadPoolExecutor(2) as ex:
    for f in [ex.submit(job, i) for i in (ONLY or range(len(lines)))]:
        try: f.result()
        except Exception as e: print('ERR', e, flush=True)
