#!/usr/bin/env bash

# Start selenium server just for this test run
(webdriver-manager update > /dev/null 2>&1 && webdriver-manager start > /dev/null 2>&1 &)
# Wait for port 4444 to be listening connections
while ! nc -z 127.0.0.1 4444; do sleep 1; done

# Finally run protractor
protractor e2e-tests/protractor.conf.js

# Cleanup webdriver-manager processes
fuser -k -n tcp 4444
