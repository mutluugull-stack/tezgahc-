#!/usr/bin/env python3
"""Android TV'ye ADB (kablosuz hata ayıklama) üzerinden bağlanmak için CLI aracı."""
import argparse
import shutil
import subprocess
import sys


def check_adb_available():
    if shutil.which("adb") is None:
        print(
            "Hata: 'adb' komutu bulunamadı. Android SDK Platform Tools kurulu ve "
            "PATH içinde olmalı (https://developer.android.com/tools/releases/platform-tools).",
            file=sys.stderr,
        )
        sys.exit(1)


def run_adb(args):
    check_adb_available()
    result = subprocess.run(["adb", *args], capture_output=True, text=True)
    output = (result.stdout + result.stderr).strip()
    print(output)
    return result.returncode, output


def cmd_pair(args):
    address = f"{args.host}:{args.port}"
    code, output = run_adb(["pair", address, args.code])
    if code != 0 or "successfully paired" not in output.lower():
        sys.exit(1)


def cmd_connect(args):
    address = f"{args.host}:{args.port}"
    code, output = run_adb(["connect", address])
    if code != 0 or ("connected" not in output.lower() and "already connected" not in output.lower()):
        sys.exit(1)


def cmd_disconnect(args):
    if args.host:
        address = f"{args.host}:{args.port}" if args.port else args.host
        run_adb(["disconnect", address])
    else:
        run_adb(["disconnect"])


def cmd_status(args):
    run_adb(["devices", "-l"])


def build_parser():
    parser = argparse.ArgumentParser(description="Android TV'ye ADB üzerinden bağlanmak için CLI aracı.")
    sub = parser.add_subparsers(dest="command", required=True)

    pair_p = sub.add_parser("pair", help="TV ile eşleştirme kodu kullanarak eşleş (Android 11+ kablosuz hata ayıklama).")
    pair_p.add_argument("host", help="TV'nin IP adresi")
    pair_p.add_argument("port", type=int, help="TV'deki eşleştirme ekranında gösterilen port")
    pair_p.add_argument("code", help="TV'deki eşleştirme ekranında gösterilen 6 haneli kod")
    pair_p.set_defaults(func=cmd_pair)

    connect_p = sub.add_parser("connect", help="TV'ye bağlan.")
    connect_p.add_argument("host", help="TV'nin IP adresi")
    connect_p.add_argument("port", type=int, nargs="?", default=5555, help="ADB bağlantı portu (varsayılan: 5555)")
    connect_p.set_defaults(func=cmd_connect)

    disconnect_p = sub.add_parser("disconnect", help="TV bağlantısını kes.")
    disconnect_p.add_argument("host", nargs="?", help="Bağlantısı kesilecek TV'nin IP adresi (boş bırakılırsa tüm cihazlar)")
    disconnect_p.add_argument("port", type=int, nargs="?", help="Port (host verildiyse)")
    disconnect_p.set_defaults(func=cmd_disconnect)

    status_p = sub.add_parser("status", help="Bağlı cihazları listele.")
    status_p.set_defaults(func=cmd_status)

    return parser


def main():
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
