import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, collection, addDoc ,getDocs} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyADQSZ3KKSZXJgcdzRMLxeQvWWVCgBcZ-Q",
  authDomain: "login-info-36ebe.firebaseapp.com",
  projectId: "login-info-36ebe",
  storageBucket: "login-info-36ebe.appspot.com",
  messagingSenderId: "1008592245213",
  appId: "1:1008592245213:web:824c1d19b2922f77172634"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
    if (user) {
      const addPostButton = document.getElementById('Addbtn');
      addPostButton.addEventListener('click', () => {
        const formElement = document.getElementById('form-container');
        formElement.style.display = 'block';
      });
  
      const submitButton = document.getElementById('submit-button');
      submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
  
        // Get the user name and blog post from the form fields
        const userName = document.getElementById('user-name').value;
        const blogPost = document.getElementById('blog-post').value;
  
        // Create a new blog post document in Firestore
        const docRef = await addDoc(collection(db, 'blog-posts'), {
          author: userName,
          content: blogPost,
          date: new Date().toLocaleDateString(),
        });
  
        // Clear the form fields
        document.getElementById('user-name').value = '';
        document.getElementById('blog-post').value = '';
  
        // Hide the form
        const formElement = document.getElementById('form-container');
        formElement.style.display = 'none';
  
        // Call the function to retrieve and display the data
        getDataFromFirestore();
      });
  
      // Function to retrieve and display the data from Firestore
      async function getDataFromFirestore() {
        const blogPostElement = document.getElementById('blog-post-display');
        blogPostElement.innerHTML = ''; // Clear the element before appending new data
      
        try {
          const querySnapshot = await getDocs(collection(db, 'blog-posts'));
          querySnapshot.docs.forEach((doc) => {
            const data = doc.data();
            blogPostElement.innerHTML += `
              <div class="blog-post">
                <h2>${data.author}</h2>
                <p>${data.content}</p>
                <p>Posted on: ${data.date}</p>
              </div>
            `;
          });
        } catch (error) {
          console.error("Error retrieving data from Firestore:", error);
        }
      }
      // Add event listener to logout button
      const logoutBtn = document.getElementById('logOutbtn');
      logoutBtn.addEventListener('click', async () => {
        try {
          await auth.signOut();
          console.log("User signed out");
          window.location.href = 'login.html'
        } catch (error) {
          console.error("Error signing out:", error);
        }
      });
    } else {
      alert("User is not logged in");
      window.location.href = "login.html"
    }
  });