.PHONY: build up local

SHELL := /bin/bash
CWD := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
THIS_FILE := $(lastword $(MAKEFILE_LIST))
WHOAMI := $(shell whoami)


build: 
	- docker-compose build

up: build
	- docker-compose up -d

local:
	- node chuckbot.js

clean:
	- docker rm -f chuck

test:
	- npm run test