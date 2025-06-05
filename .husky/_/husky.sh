#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky > $1"
  }
  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."
  if [ "$HUSKY" = "skip" ]; then
    debug "HUSKY skip env variable is set"
    exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    debug "source ~/.huskyrc"
    . ~/.huskyrc
  fi
  export readonly husky_skip_init=1
  sh -e "$0.local" "$@"
  exit $?
fi
