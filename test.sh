#!/bin/bash

npx prisma db push

npx prisma generate

npm test
