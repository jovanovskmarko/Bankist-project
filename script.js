'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'js',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//CODING CHALLENGE

//display functions
const displayMovements = function (userLoggedIn) {
  const movements = userLoggedIn.movements;
  movements.forEach(function (mov, i) {
    let type = '';
    if (mov > 0) {
      type = 'deposit';
    } else {
      type = 'withdrawal';
    }

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (userLoggedIn) {
  labelBalance.textContent = userLoggedIn.movements.reduce(function (
    acu,
    curr
  ) {
    return Number(acu) + Number(curr);
  });

  userLoggedIn.balance = Number(labelBalance.textContent);
};

//login event
let userLoggedIn;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  userLoggedIn = accounts.find(function (curr) {
    return curr.owner === username;
  });

  if (userLoggedIn?.pin === Number(pin)) {
    //DISPLAY UI AND WELCOME MESSAGE

    labelWelcome.textContent = `Welcome ${userLoggedIn.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
  }

  containerMovements.innerHTML = '';

  displayMovements(userLoggedIn);
  displayBalance(userLoggedIn);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(function (acc) {
    return acc.owner === inputTransferTo.value;
  });
  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    userLoggedIn.balance >= amount &&
    receiverAcc?.owner !== userLoggedIn.owner &&
    receiverAcc
  ) {
    userLoggedIn.movements.push(0 - amount);
    receiverAcc.movements.push(amount);
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputLoanAmount.value;
  if (
    amount > 0 &&
    userLoggedIn.movements.some(function (mov) {
      return mov >= amount * 0.1;
    })
  ) {
    userLoggedIn.movements.push(amount);
    displayMovements(userLoggedIn);
    displayBalance(userLoggedIn);
    inputLoanAmount = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputClosePin.value === userLoggedIn.pin.toString() &&
    inputCloseUsername.value === userLoggedIn.owner
  ) {
    let index = accounts.findIndex(function (acc) {
      return acc.owner === userLoggedIn.owner;
    });

    accounts.splice(index, 1);
    inputClosePin.value = inputCloseUsername.value = '';
    containerApp.style.opacity = 0;
  }
});
