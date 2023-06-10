    // Отримання ідентифікатора користувача із параметру запиту
    const userId = new URLSearchParams(window.location.search).get('user_id');
    const postListElement = document.getElementById('postList');

    // Функція для створення елементу списку постів
    function createPostListItem(post) {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `post-details.html?post_id=${post.id}`;
      link.textContent = post.title;
      listItem.appendChild(link);
      return listItem;
    }

    // Отримання даних постів користувача із API
    fetch(`https://gorest.co.in/public/v2/posts?user_id=${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Помилка завантаження постів користувача.');
        }
        return response.json();
      })
      .then(data => {
        if (!data.data || data.data.length === 0) {
          const message = document.createElement('p');
          message.textContent = 'Пости користувача не знайдені.';
          postListElement.appendChild(message);
        } else {
          data.data.forEach(post => {
            const listItem = createPostListItem(post);
            postListElement.appendChild(listItem);
          });
        }
      })
      .catch(error => {
        console.error('Помилка завантаження постів користувача:', error);
      });

    
// Modal window code
const token = 'cc0c703b857f7886b037842e2320df7bd27e3d9ce44a19cf47e9566078423086';

let activeUser = null; // Змінна активного користувача

// Отримання даних користувача із API
fetch('https://gorest.co.in/public-api/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Помилка завантаження користувачів.');
    }
    return response.json();
  })
  .then(data => {
    // Обробка даних та створення елементів списку
    const userListElement = document.getElementById('userList');
    if (data.data.length === 0) {
      userListElement.textContent = 'Користувачі не знайдені!';
      return;
    }
    data.data.forEach(user => {
      const listItem = document.createElement('li');
      listItem.textContent = user.name;

      // Додаваня обробника подій натиснення користувачем
      listItem.addEventListener('click', () => {
        // Видалення класу активного користувача в минулого активного користувача
        if (activeUser) {
          activeUser.classList.remove('active-user');
        }
        // Установка активного користувача та додавання класу активного користувача до елементу списку
        activeUser = listItem;
        activeUser.classList.add('active-user');

        // Перенаправлення на сторінку с постами користувача
        window.location.href = `user-posts.html?user_id=${user.id}`;
      });

      userListElement.appendChild(listItem);
    });
  })
  .catch(error => {
    const userListElement = document.getElementById('userList');
    userListElement.textContent = 'Користувачі не знайдені!';
    console.error(error);
  });