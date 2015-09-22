from fabric.api import *
import os

def build():
    local("gulp dist")
    if os.path.exists('./dist'):
        with cd('./dist/'):
            local("sed -i -e 's/chronos\/static/static/g' dist/*.js")
            local("sed -i -e 's/\.\./\/assets/g' dist/*.css")
            local("sed -i -e 's/http:\/\/localhost:5000/https:\/\/chronos\.practo\.com/g' dist/*.js")
            local("cp favicon.ico dist/")
