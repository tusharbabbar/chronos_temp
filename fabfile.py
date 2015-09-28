from fabric.api import *
import os

def build():
    local("gulp dist")
    if os.path.exists('./dist'):
        with cd('./dist/'):
            local("sed -i " " 's/chronos\/static/static/g' dist/*.js")
            local("sed -i " " 's/\.\./\/assets/g' dist/*.css")
            local("sed -i " " 's/http:\/\/localhost:5000/https:\/\/chronos\.practo\.com/g' dist/*.js")
            local("cp favicon.ico dist/")

def cache_bust():
    if os.path.exists('./dist'):
        import time
        signature = str(int(time.time()))
        with cd('./dist'):
            local("mv chronos.min.js chronos.min.%s.js"%signature)
            local("mv chronos.min.css chronos.min.%s.css"%signature)
            local("mv vendor.min.js vendor.min.%s.js"%signature)
            local("mv vendor.min.css vendor.min.%s.css"%signature)
            local("sed -i -e 's/vendor\.min/vendor\.min\.%s/g' index.html"%signature)
            local("sed -i -e 's/chronos\.min/chrnos\.min\.%s/g' index.html"%signature)
