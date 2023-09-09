import {
	auth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	// onAuthStateChanged,
     database,
    set,ref,update,
	// signOut,
	// doc,
	// setDoc,
	// db,
	// getDoc,
	// updateDoc,
	// getStorage,
	// storage,
	// uploadBytesResumable,
	// getDownloadURL,
	// reauthenticateWithCredential,
	// EmailAuthProvider,
	// updatePassword,
	// collection,
	// addDoc,
	// serverTimestamp,
	// query,
	// where,
	// getDocs,
	// deleteDoc,
} from './config.js';
// Loader

const spiner = document.getElementById('spiner');

function showLoader() {
	spiner.style.display = 'flex';
}
function hideLoader() {
	spiner.style.display = 'none';
}
// Sign  Up Button
let flag=true;
const signupBtn = document.getElementById('signupBtn');

const signup = () => {
	let fullName = document.getElementById('fullName');
	let Password = document.getElementById('password');
	let email = document.getElementById('email');

	const user = {
		fullName: fullName.value,
		email: email.value,
		Password: Password.value,
	};
	if (!user.fullName || !user.email  || !user.Password) {
		Swal.fire('Please fill out  all fields');
		return;
	}
	flag = false;

	createUserWithEmailAndPassword(auth, user.email, user.Password)
		.then((res) => {
            const user = res.user;
			showLoader();
			console.log(user);
			set(ref(database,'users/'+user.uid),{
                fullName : fullName.value,
                email : email.value,
                Password : Password.value
            })
            hideLoader();
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'User has been created',
				showConfirmButton: false,
				timer: 1500,
			});

			
			setTimeout(() => {
				flag = true;
				location.href = '/dashboard.html';
			}, 2000);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			let errorText = errorMessage;
			switch (errorMessage) {
				case 'Firebase: Error (auth/invalid-email).':
					errorText = 'Invalid Email';
					break;
				case 'Firebase: Error (auth/email-already-in-use).':
					errorText = 'This email is already in use. Try different';
					break;
				default:
					errorText = errorText;
			}
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorText,
			});
			hideLoader();
		});
};
signupBtn && signupBtn.addEventListener('click', signup);

// Sign IN

const signinBtn = document.getElementById('signInBtn');

const signIn = () => {
	let email = document.getElementById('email');
	let password = document.getElementById('password');
	if ((!email.value, !password.value)) {
		Swal.fire('Please fill out  all fields');
		return;
	}
	flag = false;
	showLoader();
	signInWithEmailAndPassword(auth, email.value, password.value)
		.then((res) => {
            const dt = new Date();
			const user = res.user;
			console.log(user);
            update(ref(database,'users/'+user.uid),{
                lastLogin : dt,
            })
			Swal.fire({
				position: 'center',
				icon: 'success',
				title: 'Logged In',
				showConfirmButton: false,
				timer: 1500,
			});

			hideLoader();
			setTimeout(() => {
				flag = true;
				location.href = "/dashboard.html";
			}, 2000);
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			let errorText = errorMessage;
			switch (errorMessage) {
				case 'Firebase: Error (auth/wrong-password).':
					errorText = 'Invalid Password';
					break;
				case 'Firebase: Error (auth/user-not-found).':
					errorText = 'Email is not correct';
					break;
				default:
					errorText = 'Something went wrong';
			}
			hideLoader();
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: errorText,
			});
		});
};
signinBtn && signinBtn.addEventListener('click', signIn);
