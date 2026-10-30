"""Autoriza o canal do YouTube uma única vez e guarda o refresh token num ficheiro.

Usa o fluxo para dispositivos (abre-se google.com/device no telemóvel e digita-se o código).
Precisa de um cliente OAuth do tipo "TVs e dispositivos de entrada limitada" no Google Cloud,
com a YouTube Data API v3 ativada.

    YT_CLIENT_ID=... YT_CLIENT_SECRET=... python3 tools/youtube_auth.py <ficheiro-de-saida>

O refresh token NUNCA vai para o repositório: guarde-o como variável de ambiente YT_REFRESH_TOKEN
nas definições do ambiente da nuvem.
"""
import json, os, sys, time, urllib.parse, urllib.request

SCOPE = 'https://www.googleapis.com/auth/youtube'


def post(url, data):
    req = urllib.request.Request(url, data=urllib.parse.urlencode(data).encode(), method='POST')
    try:
        return json.load(urllib.request.urlopen(req, timeout=30))
    except urllib.error.HTTPError as e:
        return json.loads(e.read() or b'{}')


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else 'youtube_refresh_token.txt'
    cid, secret = os.environ['YT_CLIENT_ID'], os.environ['YT_CLIENT_SECRET']
    d = post('https://oauth2.googleapis.com/device/code', {'client_id': cid, 'scope': SCOPE})
    if 'user_code' not in d:
        sys.exit(f'erro: {d}')
    print(f"\n1) Abra {d['verification_url']} no telemóvel\n2) Digite o código: {d['user_code']}\n3) Escolha a conta do canal e aceite\n", flush=True)
    while True:
        time.sleep(d.get('interval', 5))
        t = post('https://oauth2.googleapis.com/token', {'client_id': cid, 'client_secret': secret, 'device_code': d['device_code'],
                                                        'grant_type': 'urn:ietf:params:oauth:grant-type:device_code'})
        if 'refresh_token' in t:
            with open(out, 'w') as f:
                f.write(t['refresh_token'] + '\n')
            os.chmod(out, 0o600)
            print(f'autorizado. refresh token guardado em {out}')
            return
        if t.get('error') not in ('authorization_pending', 'slow_down'):
            sys.exit(f"erro: {t.get('error')}: {t.get('error_description')}")


if __name__ == '__main__':
    main()
