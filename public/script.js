let currentPage = 1;
const limit = 10;

function toggleDarkMode() {
  const body = document.body;
  body.dataset.theme = body.dataset.theme === "light" ? "dark" : "light";
}

function generateStars(rating = 0) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `<span data-value="${i}">${i <= rating ? "★" : "☆"}</span>`;
  }
  return stars;
}

async function loadPickupLines() {
  const category = document.getElementById('categoryFilter').value;
  const searchTerm = document.getElementById('searchBox').value.toLowerCase();
  const container = document.getElementById('pickup-lines');

  try {
    const res = await fetch(`http://localhost:3000/api/pickuplines?page=${currentPage}&limit=${limit}&category=${category}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    container.innerHTML = '';
    if (data.length === 0) {
      container.innerHTML = '<div class="loader">No pickup lines found.</div>';
      return;
    }

    const filtered = data.filter(item => item.text.toLowerCase().includes(searchTerm));

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'line-card';
      card.innerHTML = `
        <div class="line-text">${item.text}</div>
        <div class="actions">
          <button class="like-button" data-id="${item.id}" data-count="0">❤️ Like</button>
          <button class="copy-button" data-text="${item.text}">📋 Copy</button>
          <button class="share-link-button" data-id="${item.id}">📱 Share</button>
        </div>
      `;
      container.appendChild(card);
    });

    setupLikeButtons();
    setupCopyButtons();
    setupShareButtons();

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="loader">Error loading pickup lines.</div>';
  }
}

function setupLikeButtons() {
  const likedItems = JSON.parse(localStorage.getItem('likedItems')) || {};
  document.querySelectorAll('.like-button').forEach(button => {
    const id = button.getAttribute('data-id');

    if (likedItems[id]) {
      button.disabled = true;
      updateLikeDisplay(button, likedItems[id]);
    }

    button.addEventListener('click', () => {
      if (likedItems[id]) return;
      let count = parseInt(button.getAttribute('data-count') || '0') + 1;
      updateLikeDisplay(button, count);
      likedItems[id] = count;
      localStorage.setItem('likedItems', JSON.stringify(likedItems));
      button.disabled = true;
    });
  });
}

function updateLikeDisplay(button, count) {
  button.innerHTML = `❤️ Like (${count})`;
  button.setAttribute('data-count', count);
}

function setupCopyButtons() {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const text = button.getAttribute('data-text');
      navigator.clipboard.writeText(text)
        .then(() => alert('Pickup line copied to clipboard!'))
        .catch(err => console.error('Copy failed:', err));
    });
  });
}

function setupShareButtons() {
  document.querySelectorAll('.share-link-button').forEach(button => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      const shareUrl = `${window.location.origin}/pickup/${id}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Check out this pickup line!',
            text: 'Here’s a fun pickup line for you 😄',
            url: shareUrl
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      }
    });
  });
}

document.getElementById('categoryFilter').addEventListener('change', () => {
  currentPage = 1;
  loadPickupLines();
});

document.getElementById('searchBox').addEventListener('input', () => {
  loadPickupLines();
});

document.getElementById('prevBtn').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    loadPickupLines();
  }
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentPage++;
  loadPickupLines();
});

window.onload = loadPickupLines;
