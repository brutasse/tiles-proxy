Tiles-proxy
===========

This app was written for the [Django People](https://people.djangoproject.com)
website.

The problem
-----------

Django People is an ssl-only website that displays map tiles. Some map
providers support SSL but [Thunderforest](http://www.thunderforest.com/)
doesn't, meaning browsers get mixed-content warnings when displaying tiles
over HTTP.

The solution
------------

This simple proxy can be run on Heroku, which has SSL support on their
`*.herokuapp.com` app subdomains. Use the app hostname instead of the
thunderforest one to get tiles over SSL.
