# Maintainer: oxmc (https://github.com/oxmc)
pkgname=electron-spotify-webapp-git
pkgver=v0.2.0.rc2.r43.556b828
pkgrel=1
pkgdesc="A Spoify Web App based on the Electron engine."
arch=("x86_64" "i686" "aarch64" "armv7h")

_march=${CARCH}
_author="oxmc"

license=('MIT')
makedepends=('npm' 'git')
provides=("${pkgname%-git}")
conflicts=("${pkgname%-git}")
source=("git+https://github.com/${_author}/${pkgname%-git}.git")
md5sums=('SKIP')


pkgver() {
	cd "${srcdir}/${pkgname%-git}"
	printf "v%s.r%s.%s" "$(cat ./package.json | jq -r '.version' | tr '-' '.')" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
}

prepare() {
	cd "${srcdir}/${pkgname%-git}"
	npm install
	if [[ "${_march}" == "aarch64" ]]; then
		_node_arch=arm64
	elif [[ "${_march}" == "i686" ]]; then
		_node_arch=ia32
	elif [[ "${_march}" == "armv7h" ]]; then
		_node_arch=armv7l
	else
		_node_arch=x64
	fi
}

build() {
	_terminal() {
	printf "#!/bin/sh\n/usr/share/${pkgname%-git}/${pkgname%-git}\nexit \$?">"$1"
	}
	_desktop() {
	printf "[Desktop Entry]\nVersion=1.0\nTerminal=false\nType=Application\nName=Spotify\nExec=/opt/electron-spotify-webapp/spotify-webapp\nIcon=app\nCategories=Network;WebApp;Electron\nComment=A webapp of Spotify made for the Raspberry pi.\nGenericName=Network Music Player\nStartupNotify=true">"$1"
	}
	cd "${srcdir}/${pkgname%-git}"
	npm run pack:out "${srcdir}/build" -- --${_node_arch}
	[[ -d ${srcdir}/build/${pkgname%-git} ]] && rm -Rf "${srcdir}/build/${pkgname%-git}"
	if [[ "${_node_arch}" == "x64" ]]; then
		mv -u "${srcdir}/build/linux-unpacked" "${srcdir}/build/${pkgname%-git}"
	else
		mv -u "${srcdir}/build/linux-${_node_arch}-unpacked" "${srcdir}/build/${pkgname%-git}"
	fi
	_desktop "${srcdir}/${pkgname%-git}.desktop"
	_terminal "${srcdir}/${pkgname%-git}.sh"
}

package() {
	cd "${srcdir}/build/${pkgname%-git}"
	for x in `find * -type f`; do
		if [[ "${x}" =~ "electron-Spotify-webapp" ]]; then
			install -Dm755 "${srcdir}/build/${pkgname%-git}/$x" "${pkgdir}/usr/share/${pkgname%-git}/${x}"
			_error="$?"
			[[ "${_error}" != 0 ]] && exit "${_error}"
		elif [[ "${x}" =~ "LICENSE" ]]; then
			install -Dm644 "${srcdir}/build/${pkgname%-git}/${x}" "${pkgdir}/usr/share/licenses/${pkgname%-git}/`basename ${x}`"
			_error=$?
			[[ "${_error}" != 0 ]] && exit "${_error}"
		else
			install -Dm755 "${srcdir}/build/${pkgname%-git}/$x" "${pkgdir}/usr/share/${pkgname%-git}/${x}"
			_error=$?
			[[ "${_error}" != 0 ]] && (echo "Error code: ${_error}!"; exit "${_error}")
		fi
	done
	cd "${srcdir}"
	install -Dm644 "${srcdir}/${pkgname%-git}/icons/app.png" "${pkgdir}/usr/share/icons/hicolor/512x512/apps/spotify.png"
	install -Dm755 "${srcdir}/${pkgname%-git}.desktop" "${pkgdir}/usr/share/applications/${pkgname%-git}.desktop"	
	install -Dm755 "${srcdir}/${pkgname%-git}.sh" "${pkgdir}/usr/bin/spotify"
}
