var expect = require('chai').expect;
var SQS = require(__dirname + '/../lib/sqs');
var config = {
	sqs: {
		accessKey: 'ACCESS_KEY',
		accessToken: 'ACCESS_TOKEN',
		queue: 'https://sqs.us-east-1.amazonaws.com/USER_ID/QUEUE_NAME'
	}
};

describe('sqs', function(){

	describe('init', function(){

		it('should throw an error if no config object is passed', function(){
			var fn = function() { new SQS(); }
			expect(fn).to.throw(/SQS configuration is required./);
		});

		it('should throw an error if config isn\'t an object', function(){
			var fn = function() { new SQS('string'); }
			expect(fn).to.throw(/SQS configuration should be an object./);
		});

		it('should throw an error if no access key is provided', function(){
			var fn = function() { new SQS({accessToken: 'accessToken', queue: 'Queue'}); }
			expect(fn).to.throw(/SQS access key is required./);
		});

		it('should throw an error if access key isn\'t a string', function(){
			var fn = function() { new SQS({accessKey: [], accessToken: 'accessToken', queue: 'Queue'}); }
			expect(fn).to.throw(/SQS access key should be a string./);
		});

		it('should throw an error if no access token is provided', function(){
			var fn = function() { new SQS({accessKey: 'accessKey', queue: 'Queue'}); }
			expect(fn).to.throw(/SQS access token is required./);
		});

		it('should throw an error if access token isn\'t a string', function(){
			var fn = function() { new SQS({accessKey: 'accessKey', accessToken: {}, queue: 'Queue'}); }
			expect(fn).to.throw(/SQS access token should be a string./);
		});

		it('should throw an error if no queue is provided', function(){
			var fn = function() { new SQS({accessToken: 'accessToken', accessKey: 'accessKey'}); }
			expect(fn).to.throw(/SQS queue url is required./);
		});

		it('should throw an error if queue isn\'t a string', function(){
			var fn = function() { new SQS({accessKey: 'accessKey', accessToken: 'accessToken', queue: 12}); }
			expect(fn).to.throw(/SQS queue url should be a string./);
		});

		it('should throw an error if region is provided and isn\'t a string', function(){
			var fn = function() { new SQS({accessKey: 'accessKey', accessToken: 'accessToken', queue: '12', region: []}); }
			expect(fn).to.throw(/SQS region should be a string./);
		});
	});

	describe('sendMessage', function(){

		it('should throw an error if no callback', function(){
			var fn = function() {
				var sqs = new SQS(config.sqs);
				sqs.sendMessage();
			};
			expect(fn).to.throw(/callback is required./);
		});

		it('should throw an error if callback isn\'t a function', function(){
			var fn = function() {
				var sqs = new SQS(config.sqs);
				sqs.sendMessage('message', 'callback');
			};
			expect(fn).to.throw(/callback should be a function./);
		});

		it('should return an error if no message is provided', function(done){
			var sqs = new SQS(config.sqs);
			sqs.sendMessage(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.equal('SQS message is required.');
				expect(data).to.be.undefined;
				done();
			});
		});

		it('should return an error if message isn\'t a string nor object', function(done){
			var sqs = new SQS(config.sqs);
			sqs.sendMessage(12, function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.equal('SQS message should be either a string or an object.');
				expect(data).to.be.undefined;
				done();
			});
		});

		/*it('should send message to specified queue in AWS SQS', function(done){
			this.timeout('10000');
			var sqs = new SQS(config.sqs);
			sqs.sendMessage('This is a text message', function(err, data){
				expect(err).to.be.null;
				expect(data).to.have.a.property('MessageId');
				expect(data).to.have.a.property('MD5OfMessageBody');
				expect(data).to.have.a.property('ResponseMetadata');
				expect(data.ResponseMetadata).to.have.a.property('RequestId');
				done();
			});
		});

		it('should encode the message before sending', function(done){
			this.timeout('10000');
			var sqs = new SQS(config.sqs);
			sqs.sendMessage({
				id: '123457890',
				field: 'value'
			}, function(err, data){
				expect(err).to.be.null;
				expect(data).to.have.a.property('MessageId');
				expect(data).to.have.a.property('MD5OfMessageBody');
				expect(data).to.have.a.property('ResponseMetadata');
				expect(data.ResponseMetadata).to.have.a.property('RequestId');
				done();
			});
		});*/
	});

	describe('receiveMessage', function(){

		it('should throw an error if no callback', function(){
			var fn = function() {
				var sqs = new SQS(config.sqs);
				sqs.receiveMessage();
			};
			expect(fn).to.throw(/callback is required./);
		});

		it('should throw an error if callback isn\'t a function', function(){
			var fn = function() {
				var sqs = new SQS(config.sqs);
				sqs.receiveMessage('10', 'callback');
			};
			expect(fn).to.throw(/callback should be a function./);
		});

		it('should return an error if number of messages is provided and isn\'t a number', function(done){
			var sqs = new SQS(config.sqs);
			sqs.receiveMessage('12', function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.equal('SQS number of messages should be a number.');
				expect(data).to.be.undefined;
				done();
			});
		});

		/*it('should receive up to 10 messages from the specified queue in AWS SQS', function(done){
			this.timeout('10000');
			var sqs = new SQS(config.sqs);
			sqs.receiveMessage(function(err, data){
				expect(err).to.be.null;
				expect(data.length).to.be.above(0);
				for(var i = 0; i < data.length; i++)
				{
					expect(data[i]).to.have.property('Body');
					expect(data[i]).to.have.property('ReceiptHandle');
					expect(data[i]).to.have.property('MD5OfBody');
					expect(data[i]).to.have.property('MessageId');
				}
				done();
			});
		});*/
	});

	describe('deleteMessage', function(){

		it('should throw an error if no callback', function(){
			var fn = function() {
				var sqs = new SQS(config.sqs);
				sqs.deleteMessage();
			};
			expect(fn).to.throw(/callback is required./);
		});

		it('should throw an error if callback isn\'t a function', function(){
			var fn = function() {
				var sqs = new SQS(config.sqs);
				sqs.deleteMessage('message', 'callback');
			};
			expect(fn).to.throw(/callback should be a function./);
		});

		it('should return an error if no receipt handle is provided', function(done){
			var sqs = new SQS(config.sqs);
			sqs.deleteMessage(function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.equal('SQS receipt handle is required.');
				expect(data).to.be.undefined;
				done();
			});
		});

		it('should return an error if receipt handle isn\'t a string', function(done){
			var sqs = new SQS(config.sqs);
			sqs.deleteMessage([], function(err, data){
				expect(err).to.not.be.null;
				expect(err).to.be.equal('SQS receipt handle should be a string.');
				expect(data).to.be.undefined;
				done();
			});
		});

		/*it('should delete the message from the specified queue in AWS SQS', function(done){
			this.timeout('10000');
			var sqs = new SQS(config.sqs);
			sqs.receiveMessage(function(err, data){
				var receiptHandle = data[0].ReceiptHandle;
				sqs.deleteMessage(receiptHandle,function(err, data){
					expect(err).to.be.null;
					expect(data).to.have.a.property('ResponseMetadata');
					expect(data.ResponseMetadata).to.have.a.property('RequestId');
					done();
				});
			});
		});*/
	});
});
