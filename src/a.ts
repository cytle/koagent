interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return `Hello, ${person.firstName} ${person.lastName}` +    'sa ';
}

const user = { firstName: 'Jane', lastName: 'User' };

console.log(greeter(user));
