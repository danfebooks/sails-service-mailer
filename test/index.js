import { assert } from 'chai';
import MailerService from '../src/index';
import DirectMailer from '../src/DirectMailer';
import SendGridMailer from '../src/SendGridMailer';
import SendMailMailer from '../src/SendMailMailer';
import SESMailer from '../src/SESMailer';
import SMTPMailer from '../src/SMTPMailer';
import StubMailer from '../src/StubMailer';

describe('MailerService', () => {
  it('Should properly export', () => {
    assert.isFunction(MailerService);
  });

  it('Should properly create all of mailer instances', () => {
    assert.instanceOf(MailerService('direct'), DirectMailer);
    assert.instanceOf(MailerService('sendgrid', {provider: {auth: {api_key: 'SG.test'}}}), SendGridMailer);
    assert.instanceOf(MailerService('sendmail'), SendMailMailer);
    assert.instanceOf(MailerService('ses'), SESMailer);
    assert.instanceOf(MailerService('smtp'), SMTPMailer);
    assert.instanceOf(MailerService('stub'), StubMailer);

    assert.throw(() => MailerService('NOT_EXISTS'), Error);
  });

  it('Should properly send mail', done => {
    let stubMailer = MailerService('stub', {
      from: 'no-reply@danfebooks.com'
    });

    stubMailer
      .send({
        to: 'another@mail.com'
      })
      .then(result => {
        assert.equal(result.envelope.from, 'no-reply@danfebooks.com');
        assert.equal(result.envelope.to, 'another@mail.com');
        done();
      })
      .catch(done);
  });
});
