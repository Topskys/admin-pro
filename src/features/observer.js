// 被观察者（学生）
class Subject {
  constructor(name) {
    this.name = name;
    this.state = 'happy';
    this.observers = []; // 存储所有的观察者
  }
  // 收集所有的观察者
  attach(o) {
    // Subject.prototype.attach
    this.observers.push(o);
  }
  // 更新被观察者 状态的方法
  setState(newState) {
    this.state = newState; // 更新状态，this 指向被观察者 学生
    this.observers.forEach((observer) => observer.update(this)); // 通知观察者 更新它们的状态
  }
}

// 观察者 （父母和老师）
class Observer {
  constructor(name) {
    this.name = name;
  }
  update(student) {
    console.log('当前' + this.name + '被通知了', '当前' + student.name + '的状态是' + student.state);
  }
}

let student = new Subject('小明');
let parent = new Observer('父母');
let teacher = new Observer('老师');

// 被观察者存储观察者的前提，需要先接纳观察者
student.attach(parent);
student.attach(teacher);
student.setState('被欺负了');
console.log(parent, teacher, student);
