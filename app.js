const cTable = require("console.table"),
  inquirer = require("inquirer"),
  mysql = require("mysql"),
  con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "keroKero445",
    database: "employee_db",
  });
con.connect((a) => {
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
  con.query("SELECT * FROM employee", (err, res) => {
    console.table(res);
    loadMainPrompt();
  });
}
function viewEmployeesByDepartment() {
  const deptRoleIDs = [];
  con.query("SELECT * FROM department", (err, res) => {
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
        con.query(
          "SELECT * FROM department WHERE ?",
          { name: dept },
          (err, res) => {
            con.query(
              "SELECT * FROM role WHERE ?",
              { department_id: res[0].id },
              (err, res) => {
                res.forEach((row) => {
                  deptRoleIDs.push(row.id);
                });
                con.query(
                  "SELECT * FROM employee WHERE " +
                    makeIDsForQuery(deptRoleIDs),
                  (err, res) => {
                    console.table(res);
                    loadMainPrompt();
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

function makeValString(array) {
  let valString = "(";
  let iter = 0;
  array.forEach((element) => {
    if (iter > 0) {
      valString += ",";
    }
    valString += "'" + element + "'";
    iter += 1;
  });
  valString += ")";
  console.log(valString);
  return valString;
}

function viewEmployeesByManager() {
  const managerIDs = [];
  const managerNames = [];
  // with the one call, i could offer up in a table only the ones with a role_id that is someone's manager id
  con.query("SELECT * FROM employee", (err, res) => {
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
        con.query(
          "SELECT * FROM employee WHERE ?",
          { manager_id: activeManagerID },
          (err, res) => {
            console.table(res);
            loadMainPrompt();
          }
        );
      });
  });
}
function addEmployee() {
  // (first_name, last_name, role_id, manager_id)
  con.query("SELECT id, title FROM role", (err, res) => {
    console.log("\n");
    console.table(res);
  });
  con.query("SELECT id, first_name, last_name FROM employee", (err, res) =>
    console.table(res)
  );
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter employee's first name.",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter employee's last name.",
      },
      {
        type: "input",
        name: "roleID",
        message:
          "Enter the ID of the employee's role using the first table above.",
      },
      {
        type: "input",
        name: "managerID",
        message:
          "Enter the ID of the employee's manager using the second table above. Leave this blank if they do not have a manager.",
        default: null,
      },
    ])
    .then((a) => {
      // this is where i will put the answer into the db using a query
      let query = "";
      if (a.managerID) {
        const b = [a.firstName, a.lastName, a.roleID, a.managerID];
        query +=
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ";
        query += makeValString(b);
      } else {
        const b = [a.firstName, a.lastName, a.roleID];
        query +=
          "INSERT INTO employee (first_name, last_name, role_id) VALUES ";
        query += makeValString(b);
      }
      con.query(query, (err, res) => {
        // the callback
        console.log("Employee successfully added.");
        loadMainPrompt();
      });
    });
}
function removeEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message:
          "Please enter the first name of the employee you wish to remove, capitalized properly.",
      },
      {
        type: "input",
        name: "lastName",
        message:
          "Please enter the last name of the employee you wish to remove, capitalized properly.",
      },
    ])
    .then((a) => {
      con.query(
        "DELETE FROM employee WHERE ? AND ?",
        [{ first_name: a.firstName }, { last_name: a.lastName }],
        (err, res) => {
          if (err) throw err;
          // callback
          console.log("Successfully removed employee.");
          loadMainPrompt();
        }
      );
    });
}
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message:
          "Please enter the first name of the employee whose role you'd like to update.",
      },
      {
        type: "input",
        name: "lastName",
        message:
          "Please enter the last name of the employee whose role you'd like to update.",
      },

      {
        type: "number",
        name: "roleID",
        message:
          "Please enter the number of the role you'd like the employee to have.",
      },
    ])
    .then((a) => {
      //callback
      con.query(
        "UPDATE employee SET ? WHERE ? AND ?",
        [
          { role_id: a.roleID },
          { first_name: a.firstName },
          { last_name: a.lastName },
        ],
        (err, res) => {
          // callback
          loadMainPrompt();
        }
      );
    });
}
function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message:
          "Please enter the first name of the employee whose role you'd like to update.",
      },
      {
        type: "input",
        name: "lastName",
        message:
          "Please enter the last name of the employee whose role you'd like to update.",
      },

      {
        type: "number",
        name: "roleID",
        message:
          "Please enter the ID of the manager you'd like the employee to have. If you'd like them to be unmanaged, leave this blank.",
      },
    ])
    .then((a) => {
      // callback
    });
}
function viewDepartments() {}
function addDepartment() {}
function removeDepartment() {}
function viewRoles() {}
function addRole() {}
function removeRole() {}
function quit() {}
