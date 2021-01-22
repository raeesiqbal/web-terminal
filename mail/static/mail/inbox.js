document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#showmail').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#posts').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#new').innerHTML = 'New Email';

  if (check == 1){
    document.querySelector('#new').innerHTML = 'Reply Email';
    document.querySelector('#compose-recipients').value =sender;
    document.querySelector('#compose-recipients').disabled = true;
    document.querySelector('#compose-subject').disabled = true;
    if(subject.includes('Re')) {
      document.querySelector('#compose-subject').value = subject;
    }
    else{
      document.querySelector('#compose-subject').value ='Re:' + subject;

    }


  }



  document.querySelector('#compose-form').onsubmit = ()=> {

  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  fetch('/emails', {
  method: 'POST',
    body: JSON.stringify({
           recipients: recipients,
           subject: subject,
           body: body,

  })
})
.then(response => response.json())
.then(result => {
    // Print result
    console.log(result);
})
}
}

function load_mailbox(mailbox) {
  document.querySelector('#posts').innerHTML = '';

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#mailbox').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#showmail').style.display = 'none';
  document.querySelector('#posts').style.display = 'block';

  // Show the mailbox name
  document.querySelector('#mailbox').innerHTML = mailbox.charAt(0).toUpperCase() + mailbox.slice(1);

  fetch(`/emails/${mailbox}`, {
  }).then(response => response.json())
  .then(data => {
    if(data != null) {
      data.forEach(function(entry) {

        const post = document.createElement('div');
        post.className = 'post';
        const div1 = document.createElement('div');

        const h4 = document.createElement('h6');
        h4.innerHTML=entry.sender;
        h4.id = 'h4';
        const span = document.createElement('span');
        span.id='raees';
        const spant = document.createElement('span');
        spant.id = 'spant';
        spant.innerHTML=entry.timestamp;


        if(entry.subject.length > 21){
          span.innerHTML=entry.subject.substring(0,20) + '..';
        }
        else {
          span.innerHTML=entry.subject;

        }

        if(entry.read==false){
          post.style.backgroundColor = '#f0f0f0';
        }

        h4.append(span,spant);
        div1.append(h4);
        const mail_id = entry.id;

        if(mailbox=='inbox' || mailbox=='archive'){
          div2 = document.createElement('div');
          div2.className = 'iam';
          const p = document.createElement('p');
          p.id = 'para'


          const a = document.createElement('i');
          a.className='material-icons';
          a.innerHTML='archive';
          a.id = 'archive';

          if(mailbox =='archive'){
              p.innerHTML='unarchive';
              v = false ;
          }

          if(mailbox == 'inbox'){
              p.innerHTML='archive';
              v = true;
          }

          div2.append(a,p);
          post.append(div1,div2);

        }
        else{

            post.append(div1);

        }
        div1.addEventListener('click', () => load_mail(mail_id));
        div2.addEventListener('click', () => load(mail_id,v));
        document.querySelector('#posts').append(post);


})
      console.log(data);
    }
    else{
      console.log('empty');
    }

  });
}


function load(mail_id,v){

  fetch(`/emails/${mail_id}` ,{
    method: 'PUT',
    body: JSON.stringify({
        archived:v
    })
  })
  .then(result => {
      console.log(result);
  })
 setTimeout(function(){
 load_mailbox('inbox')
}, 10);


}


function load_mail(mail) {

  document.querySelector('#showmail').style.display = 'block';
  document.querySelector('#posts').style.display = 'none';
  document.querySelector('#mailbox').style.display = 'none';

  fetch(`/emails/${mail}` , {

  }).then(response => response.json())
  .then(data => {
    document.querySelector('#span1').innerHTML=data.sender;
    document.querySelector('#span2').innerHTML=data.recipients;
    document.querySelector('#span3').innerHTML=data.subject;
    document.querySelector('#span4').innerHTML=data.timestamp;

    const reply = document.querySelector('#reply');
    reply.addEventListener('click', () => compose_email(), check =1, sender = data.sender, subject = data.subject );
    console.log(data);
  })

  fetch(`/emails/${mail}` , {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})

}
