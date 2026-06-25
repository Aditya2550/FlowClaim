#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/../backend" && npm install
cd "$(dirname "$0")/../frontend" && npm install
