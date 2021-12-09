from fastapi import APIRouter, Body, Depends, HTTPException, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OpenIdConnect
import requests
from pathlib import Path
import shutil

from app import models
from app.config import settings

# Use Authlib for ORCID OpenID Connect
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import HTMLResponse, RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth, OAuthError


# Main issues discussing implementing OpenID Connect / OAuth2 in FastAPI:
# https://github.com/tiangolo/fastapi/tree/master/fastapi/security
# https://github.com/tiangolo/fastapi/issues/488
# https://github.com/tiangolo/fastapi/issues/12 OAuthFlowImplicit, OAuthFlowAuthorizationCode

reusable_oauth2 = OpenIdConnect(
    openIdConnectUrl='https://orcid.org/.well-known/openid-configuration',
    auto_error=False
    # flow='implicit' not working
)
# reusable_oauth2 = OAuth2PasswordBearer(
#     # tokenUrl=f"{settings.API_PATH}/login/access-token"
#     tokenUrl=f"https://orcid.org/oauth/authorize?client_id={settings.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=http://localhost/api/login/orcid"
# )
# reusable_oauth2 = OAuth2AuthorizationCodeBearer(
#     authorizationUrl=settings.AUTHORIZATION_URL,
#     tokenUrl=settings.TOKEN_URL
# )

def get_current_user(
    token: str = Depends(reusable_oauth2)
) -> models.User:
    # curl -i -L -H "Accept: application/json" -H "Authorization: Bearer aa4629f3-b0a2-4edd-b77a-398d7afe3c90" 'https://sandbox.orcid.org/oauth/userinfo'
    if token:
        orcid_user = requests.get('https://orcid.org/oauth/userinfo',
                            headers={'Accept': 'application/json',
                                    'Authorization': 'Bearer ' + token})
    else:
        return None
    return orcid_user.json()


router = APIRouter()

# https://fastapi.tiangolo.com/tutorial/security/#openid-connect
# https://docs.authlib.org/en/latest/client/fastapi.html
# https://blog.authlib.org/2020/fastapi-google-login
# https://github.com/authlib/demo-oauth-client/blob/master/fastapi-google-login/app.py
# Load client id and secret from env: https://docs.authlib.org/en/latest/client/starlette.html

oauth = OAuth()
oauth.register(
    name='orcid',
    server_metadata_url='https://orcid.org/.well-known/openid-configuration',
    client_id=settings.ORCID_CLIENT_ID,
    client_secret=settings.ORCID_CLIENT_SECRET,
    redirect_uri=settings.OAUTH_REDIRECT_URI,
    client_kwargs={
        'scope': '/authenticate'
        # 'scope': 'openid email profile'
    }
)


@router.post("/store-keyfile", 
    description="""Store your Nanopub key on our server to easily publish by just login with ORCID""",
    response_description="Operation result", 
    response_model={})
async def store_keyfile(
        keyfile: UploadFile = File(...),
        pubfile: UploadFile = File(...),
        current_user: models.User = Depends(get_current_user)
    ):

    if not current_user or 'id' not in current_user.keys():
        raise HTTPException(status_code=403, detail=f"You need to login to create a new collection")

    # Create user directory if does not exist
    Path(f"{settings.KEYSTORE_PATH}/{current_user['sub']}").mkdir(parents=True, exist_ok=True)

    with open(f"{settings.KEYSTORE_PATH}/{current_user['sub']}/idrsa.pub", 'w') as f:
        data = await pubfile.read()
        f.write(data.decode("utf-8"))

    with open(f"{settings.KEYSTORE_PATH}/{current_user['sub']}/idrsa", 'w') as f:
        data = await keyfile.read()
        f.write(data.decode("utf-8"))

    return JSONResponse({
        'message': 'Nanopub key stored for ' + current_user['id']
    })


@router.delete("/delete-keyfile", 
    description="""Delete the Nanopub key stored on our server associated to your ORCID""",
    response_description="Operation result", 
    response_model={})
async def delete_keyfile(
        current_user: models.User = Depends(get_current_user)
    ):

    if not current_user or 'id' not in current_user.keys():
        raise HTTPException(status_code=403, detail=f"You need to login to create a new collection")

    keyfile_folder = Path(f"{settings.KEYSTORE_PATH}/{current_user['sub']}")

    if keyfile_folder.exists():
        shutil.rmtree(keyfile_folder)

    return JSONResponse({
        'message': 'The Nanopub keyfile has been properly deleted from our servers for ' + current_user['id']
    })


@router.get('/login')
async def login(request: Request):
    auth_uri = request.url_for('auth')
    return await oauth.orcid.authorize_redirect(request, auth_uri)

@router.get('/auth')
async def auth(request: Request):
    try:
        token = await oauth.orcid.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f'<h1>{error.error}</h1>')
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    return RedirectResponse(url=f'{settings.OAUTH_REDIRECT_FRONTEND}',
        headers={"Authorization": 'Bearer ' + str(token['access_token'])})
    # return JSONResponse({"access_token": token['access_token'], "token_type": 'bearer'}, 
    #     headers={"Authorization": 'Bearer ' + str(token['access_token'])})

# curl 'http://localhost/rest/current-user' -H 'Authorization: Bearer 21807418-ee11-4097-bdc5-dc9aaf0b9296'

@router.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/docs')

@router.get('/current-user')
async def current_user(current_user: models.User = Depends(get_current_user)):
    # print('current_user')
    # print(current_user)
    return current_user





# def get_current_active_superuser(
#     current_user: models.User = Depends(get_current_user),
# ) -> models.User:
#     # if not crud.user.is_superuser(current_user):
#     #     raise HTTPException(
#     #         status_code=400, detail="The user doesn't have enough privileges"
#     #     )
#     return current_user


# # @router.get("/login/orcid", response_model={})
# @router.get("/login/orcid", response_model=schemas.Token)
# def login_orcid(
#     code: Optional[str] = None
#     # db: Session = Depends(db.get_db), form_data: OAuth2PasswordRequestForm = Depends()
# ) -> Any:
#     """
#     ORCID OpenConnect Code Authorization (OAuth2) token login, get an access token for future requests
#     """
#     print(code)
#     redirect_uri = 'http://localhost/api/login/orcid'
#     # Authentication page:
#     # https://orcid.org/oauth/authorize?client_id={settings.ORCID_CLIENT_ID}&response_type=code&scope=/authenticate&redirect_uri=http://localhost/api/login/orcid
#     data = {
#         'client_id': settings.ORCID_CLIENT_ID,
#         'client_secret': settings.ORCID_CLIENT_SECRET,
#         'redirect_uri': 'http://localhost/api/login/orcid',
#         'grant_type': 'authorization_code',
#         'code': code
#     }
#     headers = {
#         # 'Content-type': 'x-www-form-urlencoded',
#         'Accept': 'application/json'
#     }
#     orcid_token = requests.post('https://orcid.org/oauth/token',
#                         data=data, headers=headers)
#     # curl_cmd = "curl -i -L -k -H 'Accept: application/json' --data 'client_id=" + client_id + "&client_secret=" + client_id + "&grant_type=authorization_code&redirect_uri=" + redirect_uri + "&code=" + code + "' https://orcid.org/oauth/token"
#     # print(curl_cmd)
#     # orcid_resp = orcid_token.json()
#     # url = router.url_path_for("docs")
#     # response = RedirectResponse(url=url)
#     # return response
#     return orcid_token.json()