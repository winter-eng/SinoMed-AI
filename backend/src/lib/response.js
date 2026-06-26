import { NextResponse } from 'next/server'

export function ok(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function error(message, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function unauthorized() {
  return error('Unauthorized', 401)
}

export function notFound(resource = 'Resource') {
  return error(`${resource} not found`, 404)
}
