# blog-lukas.de

GitHub Repository for my own Website

## Verzeichnis:

Homepage abgelegt in:

```
cd /var/www/
```


# Set up the server

Erste Schritte nach dem Server und dem Domain Kauf.

1. Einrichten des Webservers: [https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-20-04)

2. Installieren von Apache & Virtueller Host: [https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04-de](https://www.digitalocean.com/community/tutorials/how-to-install-the-apache-web-server-on-ubuntu-20-04-de)

3. Der Domain eine IP4 Adresse zuweisen (A Zertifikat) beim Anbieter.

4. Installieren von MySQL & PHP (LAMP): [https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/how-to-install-linux-apache-mysql-php-lamp-stack-on-ubuntu-20-04)

5. Apache mit Let's Encrypt sichern: [https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-20-04](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-20-04)

6. Aoache Version verstecken: [https://www.tecmint.com/hide-apache-web-server-version-information/](https://www.tecmint.com/hide-apache-web-server-version-information/)

# Wichtige Kommandos

Hier werden wichtige Kommandos für den Webserver gelistet

## GitHub

### Download Package

Schritte zum Downloaden vom GitHub Server.

```
git clone https://gitlab.com/krauluk1/blog-lukas.de.git
```

Info: Die Daten liegen auf dem Server unter: 

```
cd /var/www/
```

Hier sollte das Paket mit sudo gedownloadet werden.

### Upload Package

Schritte zum Upload auf den GitHub Server.

```
cd blog-lukas.de.git
git add .
git commit -m "test"
git push
```

Info: Bei neuen Branches muss manchmal ein Upstream Branch eingerichtet werden (falls es noch nicht wurde).

```
git push --set-upstream origin input_branch-name
oder 
git push origin input_branch-name
```

### Aktuallisieren des Pakets

Schritte zum Aktualisieren des Pakets auf dem lokalen Computer.

```
git pull
```

### Branching

Software separat entwickeln, bis alle Teammitglieder es als okay einstufen.

Veränderungen anzeigen

```
git status
```

Lasse die Branches Synchron um merge konflikte zu vermeiden

```
git remote add upstream https://github.com/zero-to-mastery/start-here-guidelines.git
git pull upstream main
```

Zeigt alle Branches:

```
git branch
```

Hinzufügen eines Branch:

```
git branch input_branch-name
```

Wechsel zum Branch:

```
git checkout input_branch-name
```

Eigenen Name zu den Kontributors hinzufügen

```
git add CONTRIBUTORS.md
git commit -m "Add <your-github-username>"
git push origin main
Go to GitHub and make a pull request 
```

Check nach konflikten mit dem Masterbranch (Bereits geaddete Changes, die du nicht überschreiben solltest)

```
1. aktualisiere den Masterbranch
git checkout master
git pull
2. merge aktuallisierten master in deinen Branch
git checkout input_branch-name
git merge master
```

Mitlerweile wird geforkt. D.h. oben rechts kann fork ausgewählt werden. Aber auch dort wird ein Branch erstellt. Aber dieser Fork muss geupdatet werden. Dies geht so:

```
git remote -v
git remote add upstream <<link to original url>>
git remote -v

or do 
git pull upstream master
from master in your forked repo
```


## Great NPM Packages

Install NPM: [https://nodejs.org/en/](https://nodejs.org/en/)

Live-Server: You can watch code changes live when saving: [https://www.npmjs.com/package/live-server](https://www.npmjs.com/package/live-server)

Lodash gives more funktions for javascript: [https://www.npmjs.com/package/lodash](https://www.npmjs.com/package/lodash)

browserify helps add modules to the js module: [https://www.npmjs.com/package/browserify](https://www.npmjs.com/package/browserify)

React for frontend: [https://www.npmjs.com/package/react](https://www.npmjs.com/package/react)

## Apache

### Webserver stoppen

```
sudo systemctl stop apache2
```

### Webserver starten (falls angehalten)

```
sudo systemctl start apache2
```

### Dienste neu starten

```
sudo systemctl restart apache2
```

### Neu laden (bei Konfigurationsänderungen)

```
sudo systemctl reload apache2
```

### Automatisches Booten beim Serverstart dektivieren

```
sudo systemctl disable apache2
```

### Automatisches Booten beim Serverstart aktivieren

```
sudo systemctl enable apache2
```


## Google Freigabe

Damit Google die Seite kennt, muss eine sitemap.xml angelegt werden.

1. sitemap.xml erstellen: [https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=de](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=de)

2. sitemap.xml einreichen: [https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=de#addsitemap](https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?hl=de#addsitemap)

Info: Aktualisierung an Google ist im Browser mit:

```
https://www.google.com/ping?sitemap=https://blog-lukas.de/sitemap.xml
```


# Wichtige Seiten (Style)

Hier werden wichtige Seiten zum Stylen der Homepage aufgeführt.

## Almana

Enthält alle CSS Properties: [https://css-tricks.com/almanac/](https://css-tricks.com/almanac/)

## Selectors

Enthält CSS Events: [https://www.w3schools.com/cssref/css_selectors.asp](https://www.w3schools.com/cssref/css_selectors.asp)

## jQuery

Enthält bspw. Animationen. Wird benötigt für Bootstrap: [https://api.jquery.com/](https://api.jquery.com/)

## Bootstrap

Enthält alles, was das Herz begehrt: [http://holdirbootstrap.de/](http://holdirbootstrap.de/)

## Kostenlose Bilder

Enthält viele Bilder frei zur kommerziellen Nutzung: [https://pixabay.com/de/](https://pixabay.com/de/)

## Google Fonts

Enthält die Font-Family von Google: [https://fonts.google.com/](https://fonts.google.com/)

## Animation CSS3

Shows where css modules is supported: [https://caniuse.com/](https://caniuse.com/)

Shows on which Browsers the Animations are available (or if you need to use browser prefixes): [https://www.w3schools.com/cssref/css3_browsersupport.asp](https://www.w3schools.com/cssref/css3_browsersupport.asp)

Adds the prefixes automatically: [https://autoprefixer.github.io/](https://autoprefixer.github.io/)
 
Helps with prefixes: [http://shouldiprefix.com/#animations](http://shouldiprefix.com/#animations)

Great for showing some transitions: [https://thoughtbot.com/blog/transitions-and-transforms](https://thoughtbot.com/blog/transitions-and-transforms)

Finished Animation: [https://animate.style/](https://animate.style/)

## Free Sites

Some Free Sites to download and use: [https://www.creative-tim.com/](https://www.creative-tim.com/)

Free Templates: [http://www.mashup-template.com/templates.html](http://www.mashup-template.com/templates.html)



# Zero to mastery 

free Resources: [https://zerotomastery.io/resources/](https://zerotomastery.io/resources/)

Grid Cheat Sheet: [https://grid.malven.co/](https://grid.malven.co/)

What to do, when screen size get to small: [https://css-tricks.com/snippets/css/media-queries-for-standard-devices/](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/)

Free resource for css: [https://web.dev/learn/css/](https://web.dev/learn/css/)

Doom manipulation: [https://www.w3schools.com/js/js_htmldom.asp](https://www.w3schools.com/js/js_htmldom.asp)

Javascript Char Codes:  [https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes](https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes)

JavaScript Event reference: [https://developer.mozilla.org/en-US/docs/Web/Events](https://developer.mozilla.org/en-US/docs/Web/Events)



# PHP

## Information


### Error ausgeben lassen 

If you programm PHP and want to see the errors, go to `cd /etc/php/7.4/apache2` open the php.ini with `sudo nano php.ini` and change the entries:

```
( error_reporting = E_ALL )
display_errors = On
```

Always change it back, if not needet to:

```
display_errors = Off
```

and restart apache2:

```
sudo systemctl restart apache2
```