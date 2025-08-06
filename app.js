import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore,  collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCKImJibxZ6VVQz3iRjYS17YqEltaLJNFw",
  authDomain: "task-10dc6.firebaseapp.com",
  projectId: "task-10dc6",
  storageBucket: "task-10dc6.firebasestorage.app",
  messagingSenderId: "384127561669",
  appId: "1:384127561669:web:ffdac65b4e253ed417a5ac",
  measurementId: "G-C7Z8XE9BNZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let signup = document.getElementById('signup');
if( signup){
signup.addEventListener('click', (e) => {
  e.preventDefault(); // Prevent form from reloading

  let sname = document.getElementById('sname').value;
  let semail = document.getElementById('semail').value;
  let spassword = document.getElementById('spassword').value;

  createUserWithEmailAndPassword(auth, semail, spassword)
    .then((userCredential) => {
      const user = userCredential.user;

      updateProfile(user, {
        displayName: sname
      }).then(() => {
        alert("Signup successful!");
        console.log("User created:", semail);
        // Optionally redirect: window.location.href = 'login.html';
      }).catch((error) => {
        alert("Error updating profile: " + error.message);
      });
    })
    .catch((error) => {
      alert("Signup error: " + error.message);
    });
});
}



let login = document.getElementById('login');

if (login) {
  login.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent page reload

    let lemail = document.getElementById('lemail').value;
    let lpassword = document.getElementById('lpassword').value;

    signInWithEmailAndPassword(auth, lemail, lpassword)
      .then((userCredential) => {
        const user = userCredential.user;
        // Redirect to dashboard
        window.location.href = "dahboard.html";
      })
      .catch((error) => {
        alert("Login failed: " + error.message); // Show the error to the user
        console.error(error.code, error.message); // Log for debugging
      });
  });
}

 const userNameDisplay = document.getElementById('username');

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userNameDisplay.textContent = "Hello, " + (user.displayName || user.email);
      } else {
        // If not logged in, redirect to login
        window.location.href = "login.html";
      }
    });

  let logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        alert("Logged out successfully.");
        window.location.href = "login.html";
      })
      .catch((error) => {
        alert("Logout Error: " + error.message);
      });
  });
}

    const db = getFirestore(app);

    let pro = document.getElementById('pro');



if (pro) {
  pro.addEventListener('click', async (e) => {
     e.preventDefault();
    let productImage = document.getElementById('productImage').value;
    let productTitle = document.getElementById('productTitle').value;
    let productDesc = document.getElementById('productDesc').value;
    let productPrice = document.getElementById('productPrice').value;

    if (!productImage || !productTitle || !productDesc || !productPrice) {
      alert("Please fill in all product fields.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "products"), {
        image: productImage,
        title: productTitle,
        description: productDesc,
        price: productPrice
      });

     console.log("Adding product...", {
  image: productImage,
  title: productTitle,
  description: productDesc,
  price: productPrice
});
      alert("Product added successfully!");
      console.log("Document written with ID: ", docRef.id);

      // Optional: clear form fields
      document.getElementById('productImage').value = '';
      document.getElementById('productTitle').value = '';
      document.getElementById('productDesc').value = '';
      document.getElementById('productPrice').value = '';
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding product.");
    }
  });
}



let showData = async () => {
  let main = document.getElementById('main');
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((doc) => {
    let data = doc.data(); // Get Firestore document data

    main.innerHTML += `<div class="col-md-6 mb-3">
        <div class="card  shadow-sm mb-4">
          <img src="${data.image}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
            <p class="card-text fw-bold text-success">Rs ${data.price}</p>
            <a href="#" class="btn btn-primary">Buy Now</a>
          </div>
        </div>
      </div>
    `;
  });
};

showData();
