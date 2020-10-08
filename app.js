const util = require("util");
const cTable = require("console.table");
// https://www.npmjs.com/package/console.table#use-in-node
const inquirer = require("inquirer");
const mysql = require("mysql"),
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "keroKero445",
    database: "employee_db",
  });
connection.connect();
connection.query = util.promisify(connection.query);
inquirer
  .prompt([
    {
      type: "list",
      name: "todo1",
      nessage: "What would you like to do?",
      choices: [
        "View all employees",
        "View employees by dept",
        "View employees by manager",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
        "View all departments",
        "Add department",
        "Remove department",
        "View all roles",
        "Add role",
        "Remove role",
      ],
    },
  ])
  .then((todo1a) => {
    // Call the appropriate function depending on what the user chose
    switch (todo1a) {
      case "View all employees":
        return viewEmployees();
      case "View employees by dept":
        return viewEmployeesByDepartment();
      case "View employees by manager":
        return viewEmployeesByManager();
      case "Add employee":
        return addEmployee();
      case "Remove employee":
        return removeEmployee();
      case "Update employee role":
        return updateEmployeeRole();
      case "Update employee manager":
        return updateEmployeeManager();
      case "View all departments":
        return viewDepartments();
      case "Add department":
        return addDepartment();
      case "Remove department":
        return removeDepartment();
      case "View all roles":
        return viewRoles();
      case "Add role":
        return addRole();
      case "Remove role":
        return removeRole();
      default:
        return quit();
    }
  });

async function viewEmployees() {
  const employees = await connection.findAllEmployees();
  console.log("\n");
  console.table(employees);
  loadMainPrompts();
}
async function viewEmployeesByDepartment() {
  const departments = await connection.findAllDepartments();
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see employees for?",
      choices: departmentChoices,
    },
  ]);
}
async function viewEmployeesByManager() {
  const managers = await connection.findAllManagers();
  const managerChoices = managers.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { managerId } = await prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which manager would you like to see employees for?",
      choices: managerChoices,
    },
  ]);
}
async function addEmployee() {}
async function removeEmployee() {}
async function updateEmployeeRole() {}
async function updateEmployeeManager() {}
async function viewDepartments() {}
async function addDepartment() {}
async function removeDepartment() {}
async function viewRoles() {}
async function addRole() {}
async function removeRole() {}
async function quit() {}
