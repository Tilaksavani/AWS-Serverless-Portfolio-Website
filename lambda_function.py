import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = 'portfolio-contacts'
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    print(f"[INFO] Received event: {json.dumps(event)}")

    # Handle both direct calls and API Gateway proxy format
    http_method = (
        event.get('httpMethod') or
        event.get('requestContext', {}).get('http', {}).get('method') or
        'POST'  # default to POST if called directly
    )

    # Handle CORS preflight
    if http_method == 'OPTIONS':
        return cors_response(200, {'message': 'OK'})

    # Parse body — API Gateway sends it as a string, direct calls send a dict
    body = event
    if 'body' in event and event['body'] is not None:
        try:
            body = json.loads(event['body'])
        except (json.JSONDecodeError, TypeError):
            body = event.get('body', {})

    # Validate required fields
    name    = str(body.get('name', '')).strip()
    email   = str(body.get('email', '')).strip()
    message = str(body.get('message', '')).strip()

    if not all([name, email, message]):
        missing = [f for f, v in {'name': name, 'email': email, 'message': message}.items() if not v]
        print(f"[WARN] Missing fields: {missing}")
        return cors_response(400, {'error': f"Missing required fields: {', '.join(missing)}"})

    if '@' not in email:
        return cors_response(400, {'error': 'Invalid email address'})

    # Build and save item
    item = {
        'id':        str(uuid.uuid4()),
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'name':      name,
        'email':     email,
        'message':   message,
        'status':    'new'
    }

    print(f"[INFO] Saving to DynamoDB: id={item['id']}, email={email}")

    try:
        table.put_item(Item=item)
        print(f"[SUCCESS] Saved contact message: {item['id']}")
        return cors_response(200, {'message': 'Your message has been received!', 'id': item['id']})
    except Exception as e:
        print(f"[ERROR] DynamoDB write failed: {str(e)}")
        return cors_response(500, {'error': 'Failed to save your message. Please try again.'})


def cors_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
        },
        'body': json.dumps(body)
    }