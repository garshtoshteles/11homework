const util = require("util"),
  cTable = require("console.table"),
  inquirer = require("inquirer"),
  mysql = require("mysql"),
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "keroKero445",
    database: "employee_db",
  });
connection.connect((a) => {
  if (a) throw a;
  loadMainPrompt();
});
function loadMainPrompt() {
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
    .then((a) => {
      console.log("answer incoming:", a.todo1);
      switch (a.todo1) {
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
}
function viewEmployees() {
  connection.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
  });
  loadMainPrompt();
}
function viewEmployeesByDepartment() {
  const deptRoleIDs = [];
  connection.query("SELECT * FROM department", (err, res) => {
    const deptChoices = res.map((row) => row.name);
    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "For which department would you like the employees?",
          choices: deptChoices,
        },
      ])
      .then(({ dept }) => {
        // in here goes what will be done with the dept with the dept being "dept"
        connection.query(
          "SELECT * FROM department WHERE ?",
          { name: dept },
          (err, res) => {
            connection.query(
              "SELECT * FROM role WHERE ?",
              { department_id: res[0].id },
              (err, res) => {
                res.forEach((row) => {
                  deptRoleIDs.push(row.id);
                });
                connection.query(
                  "SELECT * FROM employee WHERE " +
                    makeIDsForQuery(deptRoleIDs),
                  (err, res) => {
                    console.table(res);
                  }
                );
              }
            );
          }
        );
      });
  });
}

function makeIDsForQuery(array) {
  let idEqualsString = "id in (";
  idEqualsString += array.toString();
  idEqualsString += ")";
  return idEqualsString;
}

function viewEmployeesByManager() {
  const managerIDs = [];
  const managerNames = [];
  // with the one call, i could offer up in a table only the ones with a role_id that is someone's manager id
  connection.query("SELECT * FROM employee", (err, res) => {
    res.forEach((row) => {
      if (!row.manager_id) {
        managerIDs.push(row.role_id);
        managerNames.push(row.first_name + " " + row.last_name);
      }
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "manager",
          message: "Display all employees reporting to which manager?",
          choices: managerNames,
        },
      ])
      .then((a) => {
        //in here is what is done with the answer from the managers prompt
        let activeManagerID = managerIDs[managerNames.indexOf(a.manager)];
        connection.query(
          "SELECT * FROM employee WHERE ?",
          { manager_id: activeManagerID },
          (err, res) => {
            console.table(res);
          }
        );
      });
  });
}
function addEmployee() {}
function removeEmployee() {}
function updateEmployeeRole() {}
function updateEmployeeManager() {}
function viewDepartments() {}
function addDepartment() {}
function removeDepartment() {}
function viewRoles() {}
function addRole() {}
function removeRole() {}
function quit() {}
