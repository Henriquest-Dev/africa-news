"""Envia um vídeo para o YouTube, agenda a publicação e define a thumbnail.

    python3 tools/youtube_upload.py out/zinho-02-ouro.mp4 build/02-ouro/meta.json [--thumb out/thumb.jpg] [--publish-at 2026-11-06T19:00:00Z]

Lê YT_CLIENT_ID, YT_CLIENT_SECRET e YT_REFRESH_TOKEN do ambiente.
O vídeo sobe como privado com publishAt (publicação agendada) e marcado como conteúdo
sintético (IA). Nota: enquanto o projeto da API não passar na auditoria do YouTube,
os uploads ficam bloqueados em privado e é preciso publicá-los à mão no YouTube Studio.
Custo de quota: ~1650 unidades por vídeo (a quota grátis é 10 000 por dia).
"""
import argparse, json, os, sys, urllib.parse, urllib.request


def access_token():
    data = urllib.parse.urlencode({'client_id': os.environ['YT_CLIENT_ID'], 'client_secret': os.environ['YT_CLIENT_SECRET'],
                                   'refresh_token': os.environ['YT_REFRESH_TOKEN'], 'grant_type': 'refresh_token'}).encode()
    return json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token', data=data, timeout=30))['access_token']


def upload(path, meta, token, publish_at):
    status = {'privacyStatus': 'private', 'selfDeclaredMadeForKids': False, 'containsSyntheticMedia': True}
    if publish_at:
        status['publishAt'] = publish_at
    body = {
        'snippet': {'title': meta['title'][:100], 'description': meta['description'][:4900], 'tags': meta.get('tags', [])[:30],
                    'categoryId': meta.get('categoryId', '1'), 'defaultLanguage': 'pt-BR', 'defaultAudioLanguage': 'pt-BR'},
        'status': status,
    }
    size = os.path.getsize(path)
    init = urllib.request.Request('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
                                  data=json.dumps(body).encode(), method='POST',
                                  headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json; charset=UTF-8',
                                           'X-Upload-Content-Type': 'video/mp4', 'X-Upload-Content-Length': str(size)})
    location = urllib.request.urlopen(init, timeout=60).headers['Location']
    for attempt in range(5):
        try:
            with open(path, 'rb') as f:
                put = urllib.request.Request(location, data=f, method='PUT',
                                             headers={'Authorization': f'Bearer {token}', 'Content-Type': 'video/mp4', 'Content-Length': str(size)})
                return json.load(urllib.request.urlopen(put, timeout=3600))
        except (urllib.error.URLError, ConnectionError) as e:
            print(f'  upload interrompido ({e}); tentativa {attempt + 1}', flush=True)
    sys.exit('upload falhou')


def set_thumbnail(video_id, thumb, token):
    with open(thumb, 'rb') as f:
        data = f.read()
    req = urllib.request.Request(f'https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId={video_id}&uploadType=media',
                                 data=data, method='POST', headers={'Authorization': f'Bearer {token}', 'Content-Type': 'image/jpeg'})
    try:
        urllib.request.urlopen(req, timeout=120)
        return True
    except urllib.error.HTTPError as e:  # thumbnails personalizadas exigem canal verificado por telefone
        print(f'  thumbnail não aplicada: HTTP {e.code} {e.read()[:200]!r}')
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video'); ap.add_argument('meta')
    ap.add_argument('--thumb'); ap.add_argument('--publish-at')
    a = ap.parse_args()
    meta = json.load(open(a.meta))
    token = access_token()
    v = upload(a.video, meta, token, a.publish_at)
    print(f"enviado: https://youtu.be/{v['id']}  (estado: {v['status']['privacyStatus']}, publishAt: {v['status'].get('publishAt')})")
    if a.thumb:
        set_thumbnail(v['id'], a.thumb, token)
    print(json.dumps({'id': v['id']}))


if __name__ == '__main__':
    main()
