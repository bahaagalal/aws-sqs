var AWS = require('aws-sdk');

var SQS = function(config){
	if(!config)
		throw new Error('SQS configuration is required.');

	if(typeof config != 'object')
		throw new Error('SQS configuration should be an object.');

	if(!config.accessKey)
		throw new Error('SQS access key is required.');

	if(typeof config.accessKey != 'string')
		throw new Error('SQS access key should be a string.');

	if(!config.accessToken)
		throw new Error('SQS access token is required.');

	if(typeof config.accessToken != 'string')
		throw new Error('SQS access token should be a string.');

	if(!config.queue)
		throw new Error('SQS queue url is required.');

	if(typeof config.queue != 'string')
		throw new Error('SQS queue url should be a string.');

	if(config.region && typeof config.region != 'string')
		throw new Error('SQS region should be a string.');

	this.simpleQueueService = new AWS.SQS({
		accessKeyId: config.accessKey,
		secretAccessKey: config.accessToken,
		region: config.region || 'us-east-1'
	});

	this.queue = config.queue;
};

SQS.prototype.sendMessage = function(message, callback){
	if(typeof message == 'function' && !callback)
	{
		callback = message;
		message = null;
	}

	if(!callback)
		throw new Error('callback is required.');

	if(typeof callback != 'function')
		throw new Error('callback should be a function.');

	if(!message)
		return callback('SQS message is required.');

	if(typeof message != 'string' && typeof message != 'object')
		return callback('SQS message should be either a string or an object.');

	if(typeof message != 'string')
	{
		try
		{
			message = JSON.stringify(message);
		}
		catch(e)
		{
			return callback('SQS message should be in JSON format.');
		}
	}

	this.simpleQueueService.sendMessage({
		MessageBody: message,
  		QueueUrl: this.queue,
	}, callback);
};

SQS.prototype.receiveMessage = function(numberOfMessages, callback){
	if(typeof numberOfMessages == 'function' && !callback)
	{
		callback = numberOfMessages;
		numberOfMessages = null;
	}

	if(!callback)
		throw new Error('callback is required.');

	if(typeof callback != 'function')
		throw new Error('callback should be a function.');

	if(numberOfMessages && typeof numberOfMessages != 'number')
		return callback('SQS number of messages should be a number.');

	if(!numberOfMessages)
		numberOfMessages = 10;

	this.simpleQueueService.receiveMessage({
		QueueUrl: this.queue,
		MaxNumberOfMessages: numberOfMessages
	}, function(err, data){
		if(err)
			return callback(err);

		if(!data || !data.Messages || !data.Messages.length)
			return callback(null, []);

		for(var i = 0; i < data.Messages.length; i++)
		{
			try
			{
				data.Messages[i].Body = JSON.parse(data.Messages[i].Body);
			}
			catch(e){}
		}

		return callback(null, data.Messages);
	});
};

SQS.prototype.deleteMessage = function(receiptHandle, callback){
	if(typeof receiptHandle == 'function' && !callback)
	{
		callback = receiptHandle;
		receiptHandle = null;
	}

	if(!callback)
		throw new Error('callback is required.');

	if(typeof callback != 'function')
		throw new Error('callback should be a function.');

	if(!receiptHandle)
		return callback('SQS receipt handle is required.');

	if(typeof receiptHandle != 'string')
		return callback('SQS receipt handle should be a string.');

	this.simpleQueueService.deleteMessage({
		QueueUrl: this.queue,
  		ReceiptHandle: receiptHandle,
	}, callback);
};

module.exports = SQS;
