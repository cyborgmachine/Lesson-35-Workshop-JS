const token = 'cc0c703b857f7886b037842e2320df7bd27e3d9ce44a19cf47e9566078423086';

// Значення user_id із URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('user_id');

// Функція для отримання даних користувача по його ID
function getUserData(userId) {
  return fetch(`https://gorest.co.in/public-api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка завантаження даних користувача.');
      }
      return response.json();
    });
}

// Функція отримання даних для комментарів поста
function getPostComments(postId) {
  return fetch(`https://gorest.co.in/public-api/comments?post_id=${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Помилка завантаженняя коментарів для поста.');
      }
      return response.json();
    });
}

// Отримати дані постів користувача із API
fetch(`https://gorest.co.in/public-api/posts?user_id=${userId}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Помилка завантаження постів користувача.');
    }
    return response.json();
  })
  .then(data => {
    const postListElement = document.getElementById('postList');
    const messageElement = document.getElementById('message');

    if (data.data.length === 0) {
      messageElement.textContent = 'У цього користувача відсутні пости!';

      const userListLink = document.createElement('a');
      userListLink.textContent = 'Повернутися до списку користувачів';
      userListLink.href = '#offcanvasExample';
      userListLink.addEventListener('click', (event) => {
        event.preventDefault(); // Відмінити перехід посилання

        const offcanvasElement = document.getElementById('offcanvasExample');
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.show();
      });

      messageElement.appendChild(document.createElement('br'));
      messageElement.appendChild(userListLink);

      postListElement.style.display = 'none';
      return;
    }

    // Масив промисів для запитів даних про коментарів та користувачів
    const promises = [];

    data.data.forEach(post => {
      const listItem = document.createElement('li');
      const postLink = document.createElement('a');
      const postDescription = document.createElement('p');

      postLink.textContent = post.title;
      postLink.href = `post-details.html?post_id=${post.id}`; // Посилання на сторінку з подробицями поста
      postDescription.textContent = post.body.substring(0, 100) + '...'; // Опис посту (перші 100 символів)
      listItem.appendChild(postLink);
      listItem.appendChild(postDescription);
      postListElement.appendChild(listItem);

      // Отримання дани комментарів для поста та його відображення

      const commentsPromise = getPostComments(post.id)
        .then(commentData => {
          const commentList = document.createElement('ul');

          const commentsHeader = document.createElement('h5');
          commentsHeader.textContent = 'Комментарі:';
          commentsHeader.classList.add('comments-header'); // Додавання класу 'comments-header'
          commentList.appendChild(commentsHeader);

          if (commentData.data.length === 0) {
            const noCommentsElement = document.createElement('li');
            noCommentsElement.textContent = 'Немає коментарів';
            commentList.appendChild(noCommentsElement);
            listItem.appendChild(commentList);
            return;
          }


          commentData.data.forEach(async (comment, index) => {
            const commentItem = document.createElement('li');
            // Отримання даних користувача,який залишив коментар
            const userDataPromise = getUserData(comment.user_id)
              .then(userData => {
                const commentAuthor = document.createElement('span');
                commentAuthor.textContent = userData.data.name;
                commentItem.appendChild(commentAuthor);
          
                const commentText = document.createElement('p');
                commentText.textContent = comment.body;
                commentItem.appendChild(commentText);
          
                commentList.appendChild(commentItem);
              })
              .catch(error => {
                console.error('Помилка завантаження даних користувача:', error);
              });
          
            promises.push(userDataPromise);
          });
          listItem.appendChild(commentList);
        })
        .catch(error => {
          console.error('Помилка завантаження коментарів до посту:', error);
        });

      promises.push(commentsPromise);
    });

    // Очікування запитів про коментарі та користувачів
    return Promise.all(promises);
  })
  .catch(error => {
    const postListElement = document.getElementById('postList');
    const messageElement = document.getElementById('message');
    messageElement.textContent = 'Помилка завантажування постів користувача';
    const userListLink = document.createElement('a');
    userListLink.textContent = 'Повернутися до списку користувачів';
    userListLink.href = 'users.html';
    messageElement.appendChild(document.createElement('br'));
    messageElement.appendChild(userListLink);
    postListElement.style.display = 'none';
    console.error(error);
  });
