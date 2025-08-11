import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore,  collection, addDoc, getDocs,  doc,  deleteDoc,updateDoc , getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
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
const db = getFirestore(app);
 
///////////////// AUTH WORK \\\\\\\\\\\\\\\\\\\\\\\\\\\\


let signup = document.getElementById('signup');
if( signup){
signup.addEventListener('click', (e) => {
  e.preventDefault();

  let sname = document.getElementById('sname').value;
  let semail = document.getElementById('semail').value;
  let spassword = document.getElementById('spassword').value;

  createUserWithEmailAndPassword(auth, semail, spassword)
    .then((userCredential) => {
      const user = userCredential.user;
     showData();
      updateProfile(user, {
        displayName: sname
      }).then(() => {
        alert("Signup successful!");
        console.log("User created:", semail);
      }).catch((error) => {
        alert("Error updating profile: " + error.message);
      });
    })
    .catch((error) => {
      alert("Signup error: " + error.message);
    });
});
}



let loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page reload

    let lemail = document.getElementById('lemail').value;
    let lpassword = document.getElementById('lpassword').value;

    signInWithEmailAndPassword(auth, lemail, lpassword)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = "./dahboard.html";
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
        console.error(error.code, error.message);
      });
  });
}

 const userNameDisplay = document.getElementById('username');

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userNameDisplay.textContent = "Hello, " + (user.displayName || user.email);
      } else {
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



    
    //////////////////////////DATABASE WORK///////////////////////////////////
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


let main = document.getElementById('main');
let showData = async () => {
  main.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    let data = docSnap.data();
    main.innerHTML += `
      <div class="col-md-4 mb-3">
        <div class="card shadow-sm mb-4">
          <img src="${data.image}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${data.title}</h5>
            <p class="card-text">${data.description}</p>
            <p class="card-text fw-bold text-success">Rs ${data.price}</p>
            <div class="d-flex justify-content-between">
              <a href="#" 
   onclick="editProduct('${docSnap.id}')" 
   class="btn btn-success" 
   data-bs-toggle="modal" 
   data-bs-target="#addProductModal">Edit</a>
              <a href="#" onclick="deleteData('${docSnap.id}')" class="btn btn-danger">Delete</a>
            </div>
          </div>
        </div>
      </div>
    `;
  });
};

showData();

async function deleteData(id) {
  await deleteDoc(doc(db, "products", id));
  console.log("Deleted:", id);
  showData(); 
}

window.deleteData = deleteData; 

async function editProduct(id) {
  console.log(id)
  const productRef = doc(db, "products", id);
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    const data = productSnap.data();

    
    document.getElementById('productImage').value = data.image || '';
    document.getElementById('productTitle').value = data.title || '';
    document.getElementById('productDesc').value = data.description || '';
    document.getElementById('productPrice').value = data.price || '';


    let proBtn = document.getElementById('pro');
    proBtn.textContent = "Update Product"; 


    let newProBtn = proBtn.cloneNode(true);
    proBtn.parentNode.replaceChild(newProBtn, proBtn);

   
    newProBtn.addEventListener('click', async function updateHandler(e) {
      e.preventDefault();

      let updatedData = {
        image: document.getElementById('productImage').value,
        title: document.getElementById('productTitle').value,
        description: document.getElementById('productDesc').value,
        price: Number(document.getElementById('productPrice').value)
      };

      try {
        await updateDoc(productRef, updatedData);
        alert('Product updated successfully!');
        new bootstrap.Modal(document.getElementById('addProductModal')).hide();
        showData();
     
        newProBtn.textContent = "Add Product";
      
        newProBtn.removeEventListener('click', updateHandler);
      } catch (error) {
        alert('Error updating product: ' + error.message);
      }
    });
  } else {
    alert("Product not found!");
  }
};

window.editProduct = editProduct;




const mains = document.getElementById("mains");
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  showDatas();
});

async function showDatas() {
  mains.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnap) => {
    let data = docSnap.data();

    let checkoutButtonHtml = "";
    if (currentUser) {
      checkoutButtonHtml = `<button class="btn btn-primary" onclick="checkoutProduct('${docSnap.id}')">Checkout</button>`;
    } else {
      checkoutButtonHtml = `<small class="text-muted">Login to purchase</small>`;
    }

    mains.innerHTML += `
       <div class="col-md-4 mb-3">
    <div class="card shadow-sm mb-4">
      <img src="${data.image}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
      <div class="card-body">
        <h5 class="card-title">${data.title}</h5>
        <p class="card-text">${data.description}</p>
        <p class="card-text fw-bold text-success">Rs ${data.price}</p>
        <a href="checkout.html?productId=${docSnap.id}" class="btn btn-primary">Checkout</a>
      </div>
    </div>
  </div>
    `;
  });


}

window.showDatas = showDatas;

window.checkoutProduct = function checkoutProduct(productId) {
  if (!currentUser) {
    alert("Please login to proceed with purchase.");
    return;
  }
  alert("Product " + productId + " purchased successfully!");
  // Yahan checkout process ya redirect daal sakte hain
};

