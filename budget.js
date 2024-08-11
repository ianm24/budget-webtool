//===========================
// BACKEND CLASSES/FUNCTIONS
//===========================

//===Start Budget Classes===
class Bucket {
  constructor(display_name, value) {
    this.display_name = display_name;
    this.value = Number(value.toFixed(2));
  }

  modifyValue(value_modifier) {
    var new_val = Number((this.value + value_modifier).toFixed(2));
    this.value = new_val;
  }
}

class Transaction {
  constructor(id, date, bucket,
    description, value,
    bucket_before) {
    this.id = id;
    this.date = date;
    this.bucket = bucket;
    this.description = description;
    this.value = Number(value.toFixed(2));
    this.bucket_before = Number(bucket_before.toFixed(2));
    this.bucket_after = Number((this.bucket_before + this.value).toFixed(2));
  }

  // Returns comparison of transaction dates and ids:
  // negative if a < b, 0 if a=b, positive if a > b
  // (pos and neg switch if asc is false)
  static dateCompare(a, b, asc) {
    var date_a = new Date(a.date);
    var date_b = new Date(b.date);
    var date_sort_val = Math.pow(-1, 1 + asc) * date_a + Math.pow(-1, asc) * date_b;
    var id_sort_val = Math.pow(-1, 1 + asc) * a.id + Math.pow(-1, asc) * b.id;
    return date_sort_val + id_sort_val;
  }
}

const valid_sort_fields = ["id", "date", "bucket", "value"];
class Ledger {
  constructor() {
    this.transactions = {};
    this.id_counter = 0;
    this.sort_field = "date";
    this.sort_dir_asc = false;
  }

  addTransaction(transaction) {
    var ledger_id = "_" + transaction.id;
    this.transactions[ledger_id] = transaction;
    var new_bucket_val = Number((transaction.bucket_before + transaction.value).toFixed(2));

    // If this transaction's date is before the latest transaction, update future transactions
    this.sortLedger("date", false);
    var latest_ledger_id = Object.keys(this.transactions)[0];
    var latest_transaction = this.transactions[latest_ledger_id];
    if (Transaction.dateCompare(transaction, latest_transaction, true) < 0) {
      var adjacent_ledger_ids = this.getAdjacentTransactions(ledger_id);
      var before_id = adjacent_ledger_ids[0];

      var new_bucket_before = 0;
      if (before_id != ledger_id) {
        new_bucket_before = this.transactions[before_id];
      }
      this.transactions[ledger_id].bucket_before = new_bucket_before;

      // update the rest of the transactions in this bucket
      new_bucket_val = this.updateLedger(before_id);
    }
    // Update ledger id counter
    this.id_counter++;
    this.sortLedger();
    return new_bucket_val;
  }

  // Returns the new bucket value after updating all ledger transactions in the removed transaction's bucket
  removeTransaction(ledger_id) {
    // Update all transactions in the corresponding bucket
    var adjacent_ledger_ids = this.getAdjacentTransactions(ledger_id);
    var before_id = adjacent_ledger_ids[0];
    var after_id = adjacent_ledger_ids[1];

    var new_bucket_before = 0;
    if (before_id != ledger_id) {
      new_bucket_before = this.transactions[before_id].bucket_after;
    }

    this.transactions[after_id].bucket_before = new_bucket_before;

    // update the rest of the transactions in this bucket
    var new_bucket_val = this.updateLedger(after_id);

    // Delete transaction
    delete this.transactions[ledger_id];

    //return the new value of the bucket
    return new_bucket_val;
  }

  editTransaction(ledger_id, new_transaction) {
    // Get old transaction and bucket values
    var old_transaction = this.transactions[ledger_id];
    var new_bucket_vals = [[old_transaction.bucket, old_transaction.bucket_after],
    [new_transaction.bucket, new_transaction.bucket_after]];

    // If this transaction's date is before the latest transaction, update future transactions
    this.sortLedger("date", false);
    var latest_ledger_id = Object.keys(this.transactions)[0];
    var latest_transaction = this.transactions[latest_ledger_id];

    if (Transaction.dateCompare(new_transaction, latest_transaction, true) < 0) {

      if (old_transaction.bucket != new_transaction.bucket) {
        // Update old bucket's transactions
        new_bucket_vals[0][1] = this.removeTransaction(ledger_id);
      }

      // Put edited transaction where it belongs
      this.transactions[ledger_id] = new_transaction;
      this.sortLedger("date", false);

      var adjacent_ledger_ids = this.getAdjacentTransactions(ledger_id);
      var before_id = adjacent_ledger_ids[0];

      var new_bucket_before = 0;
      if (before_id != ledger_id) {
        new_bucket_before = this.transactions[before_id];
      }
      this.transactions[ledger_id].bucket_before = new_bucket_before;

      // update the rest of the transactions in this bucket
      new_bucket_vals[1][1] = this.updateLedger(before_id);
    } else {
      this.transactions[ledger_id] = new_transaction;
    }

    this.sortLedger();
    return new_bucket_vals;
  }

  // asc: true is sort should be in ascending order, false if descending
  // First sorts by the chosen field, then by transaction ID
  sortLedger(field = this.sort_field, asc = this.sort_dir_asc) {
    var existing_transactions = this.transactions;
    switch (field) {
      case "id":
        this.transactions = Object.fromEntries(
          // (-1)^(1+asc) * a + (-1)^(asc) * b = {a-b if asc=true; b-a if asc=false}
          Object.entries(existing_transactions).sort(function (a, b) {
            return Math.pow(-1, 1 + asc) * a[1][field] + Math.pow(-1, asc) * b[1][field];
          })
        );
        break;
      case "bucket": // TODO make sorting by this keep a consistent date sor within bucket
        this.transactions = Object.fromEntries(
          Object.entries(existing_transactions).sort(function (a, b) {
            var date_sort_val = Transaction.dateCompare(a[1], b[1], false);
            if (a[1][field] > b[1][field]) {
              var bucket_sort_val = -1 * Math.pow(-1, 1 + asc);
              return bucket_sort_val;
            }
            if (b[1][field] > a[1][field]) {
              var bucket_sort_val = 1 * Math.pow(-1, 1 + asc);
              return bucket_sort_val;
            }
            return 0;
          })
        );
        break;
      case "date":
        this.transactions = Object.fromEntries(
          Object.entries(existing_transactions).sort(function (a, b) {
            return Transaction.dateCompare(a[1], b[1], asc);
          })
        );
        break;
      case "value":
        this.transactions = Object.fromEntries(
          // (-1)^(1+asc) * a + (-1)^(asc) * b = {a-b if asc=true; b-a if asc=false}
          Object.entries(existing_transactions).sort(function (a, b) {
            return Math.pow(-1, 1 + asc) * a[1][field] + Math.pow(-1, asc) * b[1][field];
          })
        );
        break;
    }
  }

  setLedgerSortParams(field, asc) {
    if (!valid_sort_fields.includes(field) || typeof (asc) != "boolean") {
      return false;
    }

    this.sort_field = field;
    this.sort_dir_asc = asc;
    return true;
  }

  // Returns the ledger ids of the transactions before and after the input transaction
  getAdjacentTransactions(ledger_id) {
    // Yes I know sorting twice is inefficient but for the scale of a personal budget,
    // It shouldn't affect performance too much (my current paper ledger has ~5000 entries for the past 5 years)
    this.sortLedger("date", false);

    var transaction = this.transactions[ledger_id];
    var target_bucket = transaction.bucket;

    // get the transaction in this bucket before this and note its bucket after
    var ledger_ids = Object.keys(this.transactions);
    var ledger_id_key_idx = ledger_ids.indexOf(ledger_id);

    // If a previous transaction in this bucket isn't found, this is the first
    var before_id = ledger_id;

    // Assumes ledger is sorted by date then id in descending order
    for (var i = ledger_id_key_idx + 1; i < ledger_ids.length; i++) {
      var curr_ledger_id = ledger_ids[i];
      var curr_transaction = this.transactions[curr_ledger_id];

      if (curr_transaction.bucket == target_bucket) {
        before_id = curr_ledger_id;
        break;
      }
    }

    // Get the transaction in this bucket after this and set its before to the other's after
    var after_id = ledger_id;

    // Assumes ledger is sorted by id in descending order
    for (var i = ledger_id_key_idx - 1; i >= 0; i--) {
      var curr_ledger_id = ledger_ids[i];
      var curr_transaction = this.transactions[curr_ledger_id];

      if (curr_transaction.bucket == target_bucket) {
        after_id = curr_ledger_id;
        break;
      }
    }

    this.sortLedger();
    return [before_id, after_id];
  }

  // Returns the new bucket value after updating all ledger transactions in that bucket
  updateLedger(ledger_id) {
    // Starting at ledger_id, update every transaction in that bucket with new bucket_before
    var transaction = this.transactions[ledger_id];
    var target_bucket = transaction.bucket;
    var curr_bucket_before = transaction.bucket_before;
    var curr_bucket_val = 0;

    var ledger_ids = Object.keys(this.transactions);
    // Assumes ledger is sorted by date and id in descending order
    for (var i = ledger_ids.indexOf(ledger_id); i >= 0; i--) {
      var curr_ledger_id = ledger_ids[i];
      var transaction = this.transactions[curr_ledger_id];

      if (transaction.bucket != target_bucket) {
        continue;
      }

      transaction.bucket_before = curr_bucket_before;
      transaction.bucket_after = Number((transaction.bucket_before + transaction.value).toFixed(2));
      curr_bucket_before = transaction.bucket_after;
      curr_bucket_val = transaction.bucket_after;
    }

    return curr_bucket_val;
  }

  updateBucketName(bucket, new_bucket_id, new_bucket_name) {

    // Add transaction in bucket to indicate changed name
    var bucket_name = bucket.display_name;
    var bucket_id = bucket_name.toLowerCase().replaceAll(" ", "_");
    var bucket_val = bucket.value;

    var ledger_id = "_" + this.id_counter;
    var name_change_transaction = new Transaction(
      ledger_id, "", new_bucket_id,
      "Bucket name change from \"" + bucket_name + "\" to \"" +
      new_bucket_name + "\"", 0, bucket_val
    );
    this.transactions[ledger_id] = name_change_transaction;
    this.id_counter++;

    // Update all transactions in the old bucket to the new bucket name
    for (var ledger_id in this.transactions) {
      var transaction = this.transactions[ledger_id];
      if (transaction.bucket == bucket_id) {
        transaction.bucket = new_bucket_id;
      }
    }
  }
}

class Budget {
  constructor() {
    // Dictionary of bucket ids and objects
    this.buckets = {};
    this.ledger = new Ledger();
  }

  addBucket(name, value) {
    var new_bucket = new Bucket(name, value);
    var bucket_id = name.toLowerCase().replaceAll(" ", "_");
    if (this.buckets[bucket_id] != null) {
      // Can't have duplicate buckets
      return false;
    }
    this.buckets[bucket_id] = new_bucket;
    return true;
  }

  removeBucket(bucket_id) {
    if (this.buckets[bucket_id] == null) {
      // Can't remove nonexistent buckets
      return false;
    }
    delete this.buckets[bucket_id];
    return true;
  }

  editBucket(bucket_id, new_bucket_name) {
    var new_bucket_id = new_bucket_name.toLowerCase().replaceAll(" ", "_");
    if (this.buckets[new_bucket_id] != null) {
      // Can't have duplicate buckets
      return false;
    }

    // Update bucket name in ledger
    this.ledger.updateBucketName(this.buckets[bucket_id], new_bucket_id, new_bucket_name);

    // Update key and display name (using defineProperty preserves order of buckets)
    Object.defineProperty(this.buckets, new_bucket_id, Object.getOwnPropertyDescriptor(this.buckets, bucket_id));
    this.buckets[new_bucket_id].display_name = new_bucket_name;
    delete this.buckets[bucket_id];

    return true;
  }

  addTransaction(date, bucket, description, value) {
    var transaction = new Transaction(this.ledger.id_counter,
      date, bucket, description, Number(value.toFixed(2)),
      this.buckets[bucket].value
    );

    // this.buckets[bucket].value = Number((this.buckets[bucket].value + value).toFixed(2));
    this.buckets[bucket].value = this.ledger.addTransaction(transaction);
    return true;
  }

  removeTransaction(transaction_id) {
    var transaction = this.ledger.transactions[transaction_id];
    var target_bucket = transaction.bucket;

    if (this.sort_field == "id" && this.sort_dir_asc == false) {
      this.buckets[target_bucket].value = this.ledger.removeTransaction(transaction_id);
      return true;
    }

    this.buckets[target_bucket].value = this.ledger.removeTransaction(transaction_id);

    return true;
  }

  editTransaction(date, bucket, description, value, transaction_id) {
    var new_transaction = new Transaction(Number(transaction_id.replace("_", "")),
      date, bucket, description, Number(value.toFixed(2)),
      this.ledger.transactions[transaction_id].bucket_before
    );

    var bucket_vals = this.ledger.editTransaction(transaction_id, new_transaction);
    this.buckets[bucket_vals[0][0]].value = bucket_vals[0][1];
    this.buckets[bucket_vals[1][0]].value = bucket_vals[1][1];

    return true;
  }

  sortLedger() {
    this.ledger.sortLedger();
    return true;
  }

  setLedgerSortParams(sort_field, sort_dir_asc) {
    return this.ledger.setLedgerSortParams(sort_field, sort_dir_asc);
  }
}
//===End Budget Classes===

// ===Start File Import/Export Functions===
function importJSON(object) {
  var imported_budget = new Budget();

  // If there are any objects that aren't correctly defined in the import file, let user know
  // TODO make this more informative:
  // [bucket_display_name,bucket_value,duplicate_bucket,sort_field,sort_dir_asc,ledger_transactions,
  // transaction(id,date,bucket,bucket_before,value,description)]
  var invalid_JSON = false;

  // Add all the buckets
  if (!object.buckets) {
    invalid_JSON = true;
  } else {
    var bucket_keys = Object.keys(object.buckets);
    for (var i = 0; i < bucket_keys.length; i++) {
      var curr_bucket = object.buckets[bucket_keys[i]];
      var name = "";
      var val = 0;

      // Bucket input validation
      if (curr_bucket.display_name == null || typeof (curr_bucket.display_name) != "string") {
        invalid_JSON = true;
        name = "INVALID_JSON_BUCKET_" + i;
      } else {
        name = curr_bucket.display_name;
      }

      if (curr_bucket.value == null || typeof (curr_bucket.value) != "number") {
        invalid_JSON = true;
        val = 0
      } else {
        val = curr_bucket.value;
      }
      var success = imported_budget.addBucket(name, val);
      if (!success) {
        invalid_JSON = true;
        imported_budget.addBucket("INVALID_JSON_BUCKET_" + i, val);
      }
    }
  }

  // Ledger input validation
  if (!object.ledger || !object.ledger.transactions) {
    invalid_JSON = true;
  } else {
    // Sort input validation
    if (object.ledger.sort_field == null || typeof (object.ledger.sort_field) != "string" ||
      !valid_sort_fields.includes(object.ledger.sort_field)) {

      invalid_JSON = true;
      imported_budget.ledger.sort_field = valid_sort_fields[0];
    } else {
      imported_budget.ledger.sort_field = object.ledger.sort_field;
    }

    if (object.ledger.sort_dir_asc == null || typeof (object.ledger.sort_dir_asc) != "boolean") {
      invalid_JSON = true;
      imported_budget.ledger.sort_dir_asc = false;
    } else {
      imported_budget.ledger.sort_dir_asc = object.ledger.sort_dir_asc;
    }

    // check that each transaction has the required fields (even if empty)
    var invalid_id_counter = 0;
    var max_id = 0;
    var imported_transactions = {};
    var import_ledger_keys = Object.keys(object.ledger.transactions);
    for (var i = 0; i < import_ledger_keys.length; i++) {
      var curr_transaction = object.ledger.transactions[import_ledger_keys[i]];
      var curr_id = invalid_id_counter;
      var curr_date = "0001-01-01";
      var curr_bucket = "INVALID_JSON_TRANSACTION_BUCKET";
      var curr_bucket_before = 0;
      var curr_val = 0;
      var curr_desc = "INVALID_JSON_DESCRIPTION";

      if (curr_transaction.id == null || typeof (curr_transaction.id) != "number") {
        invalid_JSON = true;
        invalid_id_counter++;
      } else {
        curr_id = curr_transaction.id;
        max_id = Math.max(max_id, curr_id);
      }

      //Check Date
      if (curr_transaction.date == null || typeof (curr_transaction.date) != "string"
        || curr_transaction.date.match("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]") == null) {
        invalid_JSON = true;
      } else {
        curr_date = curr_transaction.date;
      }

      // Check bucket
      if (curr_transaction.bucket == null || typeof (curr_transaction.bucket) != "string") {
        invalid_JSON = true;
      } else if (Object.keys(imported_budget.buckets).indexOf(curr_transaction.bucket)) {
        invalid_JSON = true;
        curr_bucket = curr_transaction.bucket;
      } else {
        curr_bucket = curr_transaction.bucket;
      }

      // Check Bucket before
      if (curr_transaction.bucket_before == null || typeof (curr_transaction.bucket_before) != "number") {
        invalid_JSON = true;
      } else {
        curr_bucket_before = curr_transaction.bucket_before;
      }

      // Check value
      if (curr_transaction.value == null || typeof (curr_transaction.value) != "number") {
        invalid_JSON = true;
      } else {
        curr_val = curr_transaction.value;
      }

      // Check description
      if (curr_transaction.description == null || typeof (curr_transaction.description) != "string") {
        invalid_JSON = true;
      } else {
        curr_desc = curr_transaction.description;
      }

      imported_transactions[import_ledger_keys[i]] = new Transaction(curr_id, curr_date, curr_bucket,
        curr_desc, curr_val, curr_bucket_before)
    }
    imported_budget.ledger.transactions = imported_transactions;

    // Check id_counter
    if (object.ledger.id_counter == null || typeof (object.ledger.id_counter) != "number" ||
      object.ledger.id_counter < max_id + invalid_id_counter) {
      invalid_JSON = true;
      imported_budget.ledger.id_counter = max_id + invalid_id_counter;
    } else {
      imported_budget.ledger.id_counter = object.ledger.id_counter;
    }

  }


  BUDGET = imported_budget;
}


var exportDataFile = null;
function exportJSON(budget) {
  const data = new Blob([JSON.stringify(budget)], { type: "application/json" });

  // If replacing previous file, revoke object URL to avoid memory leaks
  if (exportDataFile !== null) {
    window.URL.revokeObjectURL(exportDataFile);
  }

  exportDataFile = window.URL.createObjectURL(data);
}
// ===End File Import/Export Functions===

// ==================
// FUNCTIONS FOR HTML
// ==================

var BUDGET = new Budget();
//TODO add customizable formatters for different currencies
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

// allows user to import data
const valid_file_import_types = ["application/json"];
function importData() {
  var input = document.getElementById("data-upload")
  var files = input.files;
  if (files.length != 1) {
    alert("Please upload one data file before trying to import.");
    return;
  }

  var file = files[0];
  var file_type = file.type;
  if (!valid_file_import_types.includes(file_type)) {
    alert("Please upload an accepted file type: [" + valid_file_import_types + "].");
  }

  // Make promise to ensure data is read from file before being used in import functions
  var file_read_promise = new Promise(function (resolve, reject) {
    var reader = new FileReader();

    switch (file_type) {
      case 'application/json':
        //Wait until read finished before importing data
        reader.onloadend = function () {
          var object = JSON.parse(reader.result);
          importJSON(object);
          resolve();
        }
        break;
      // TODO allow csv import
    }

    // Handle error
    reader.onerror = function (error) {
      reject(error);
    }

    reader.readAsText(file);
  });
  file_read_promise.then(
    function () {
      updateBucketTable();
      updateLedgerTable();
    },
    function (error) {
      alert(error);
    }
  );
}

function exportData(filetype) {
  // Set object URL for the current budget
  switch (filetype) {
    case 'json':
      exportJSON(BUDGET);
      break;
    // TODO allow csv export
  }

  // Click the object URL link to download
  var link = document.createElement('a');
  link.setAttribute('download', 'budget.' + filetype);
  link.href = exportDataFile;
  link.click();
}

function updateBucketTable() {
  // Empty table
  var table = document.getElementById("bucket-table");
  table.innerHTML = "";

  // Empty Select
  var select = document.getElementById("bucket-input");
  select.innerHTML = "<option value='' disabled selected>Select a bucket</option>";

  // Add header
  var header_labels = ["Bucket", "Value", "", ""];
  var header = document.createElement('tr');

  for (var i = 0; i < header_labels.length; i++) {
    var cell = document.createElement('th');
    cell.innerHTML = header_labels[i];
    header.appendChild(cell);
  }
  table.appendChild(header);



  // Add buckets
  for (var bucket_id in BUDGET.buckets) {
    var entry = document.createElement('tr');
    var bucket = BUDGET.buckets[bucket_id];

    // Entry values
    var name_entry = document.createElement('td');
    name_entry.setAttribute("id", bucket_id);
    name_entry.innerHTML = bucket.display_name;

    var value_entry = document.createElement('td');
    value_entry.innerHTML = formatter.format(bucket.value);

    // Edit and remove buttons
    var edit_button = document.createElement('td');
    edit_button.innerHTML = "<button class='bucket-edit' onclick='editBucket(\"" + bucket_id + "\",this)'>Edit</button>"

    var remove_button = document.createElement('td');
    remove_button.innerHTML = "<button class='bucket-remove' onclick='removeBucket(\"" + bucket_id + "\")'>Remove</button>"

    // Add to table
    entry.appendChild(name_entry);
    entry.appendChild(value_entry);
    entry.appendChild(edit_button);
    entry.appendChild(remove_button);
    table.appendChild(entry);

    // Update transaction bucket selector
    var select_option = document.createElement('option');
    select_option.setAttribute("value", bucket_id);
    select_option.innerHTML = bucket.display_name;

    select.appendChild(select_option);
  }

  // Empty new bucket fields
  document.getElementById("new-bucket-name").value = "";

}

function addBucket() {
  var new_bucket_name = document.getElementById("new-bucket-name").value;
  if (new_bucket_name == "") {
    alert("Please enter a name for the new bucket.");
    return;
  }
  var success = BUDGET.addBucket(new_bucket_name, 0);

  // If bucket already exists, alert user
  if (!success) {
    alert("New bucket name too similar to existing bucket name.");
    return;
  }

  // Update bucket list
  updateBucketTable();
}

// Remove bucket and update list
function removeBucket(bucket_id) {
  BUDGET.removeBucket(bucket_id);
  updateBucketTable();
}

// Edit bucket name
function editBucket(bucket_id, edit_button) {
  // Get cell that bucket name is in and change to input field
  var cell = document.getElementById(bucket_id);
  var curr_cell_inner = cell.innerHTML;
  cell.innerHTML = "<input id='" + bucket_id + "_edit' type='text' Value='" + curr_cell_inner + "'>";

  // Add cancel button under input field
  cell.innerHTML += "<button id='" + bucket_id + "_cancel' onclick='cancelBucketEdit(\"" + bucket_id + "\",this)'>Cancel</button>";

  // Change this button to Submit Changes
  edit_button.setAttribute("id", bucket_id + "_submit");
  edit_button.setAttribute("onclick", "confirmBucketEdit(\"" + bucket_id + "\")");
  edit_button.innerHTML = "Submit Changes";
}

function cancelBucketEdit(bucket_id, cancel_button) {
  // Replace input with plane-text of the bucket's display name
  var cell = document.getElementById(bucket_id);
  cell.innerHTML = BUDGET.buckets[bucket_id].display_name;

  // Switch Submit Changes button back to Edit
  var submit_button = document.getElementById(bucket_id + "_submit");
  submit_button.removeAttribute("id");
  submit_button.setAttribute("onclick", "editBucket(\"" + bucket_id + "\",this)")
  submit_button.innerHTML = "Edit";

  // Remove cancel button
  cancel_button.remove();
}

function confirmBucketEdit(bucket_id) {
  // Check if new bucket name is valid, if not, give alert
  var new_bucket_name = document.getElementById(bucket_id + "_edit").value;
  var success = BUDGET.editBucket(bucket_id, new_bucket_name);
  if (!success) {
    alert("New bucket name too similar to existing bucket name.");
    return;
  }
  // Update bucket list
  updateBucketTable();

  // Update ledger items associated with changed bucket
  updateLedgerTable();
}

function updateLedgerTable() {
  // Empty table
  var table = document.getElementById("ledger-table");
  table.innerHTML = "";

  // Add header
  var header_labels = ["Date", "Bucket", "Description",
    "Value", "Bucket Value Before", "Bucket Value After"];
  var sortable_labels = ["Date", "Bucket", "Value"];
  var header = document.createElement('tr');

  for (var i = 0; i < header_labels.length; i++) {
    var cell = document.createElement('th');

    // Allow users to sort by different fields
    if (sortable_labels.includes(header_labels[i])) {
      var sort_button = document.createElement("button");
      var sort_function = "sortLedgerTable('" + header_labels[i].toLowerCase() + "',true,this)";
      var button_text = header_labels[i];

      if (header_labels[i].toLowerCase() == BUDGET.ledger.sort_field) {
        sort_function = "sortLedgerTable('" + header_labels[i].toLowerCase() + "'," + !BUDGET.ledger.sort_dir_asc + ",this)";
        button_text += BUDGET.ledger.sort_dir_asc ? " v" : " ^";
      }

      sort_button.setAttribute("onclick", sort_function);
      sort_button.innerHTML = button_text;
      cell.appendChild(sort_button);
    } else {
      cell.innerHTML = header_labels[i];
    }
    header.appendChild(cell);
  }
  table.appendChild(header);

  // Get transactions in reverse order added
  BUDGET.sortLedger();

  // Add transactions
  for (var ledger_id in BUDGET.ledger.transactions) {
    var transaction = BUDGET.ledger.transactions[ledger_id];

    var entry = document.createElement('tr');

    // Entry values
    var date_entry = document.createElement('td');
    date_entry.setAttribute("id", ledger_id + "-date");
    date_entry.innerHTML = transaction.date;

    var bucket_entry = document.createElement('td');
    bucket_entry.setAttribute("id", ledger_id + "-bucket");
    // If bucket name has changed, display id
    if (BUDGET.buckets[transaction.bucket] == null) {
      bucket_entry.innerHTML = transaction.bucket;
    } else {
      bucket_entry.innerHTML = BUDGET.buckets[transaction.bucket].display_name;
    }

    var desc_entry = document.createElement('td');
    desc_entry.setAttribute("id", ledger_id + "-description");
    desc_entry.innerHTML = transaction.description;

    var value_entry = document.createElement('td');
    value_entry.setAttribute("id", ledger_id + "-value");
    value_entry.innerHTML = formatter.format(transaction.value);

    var buck_bef_entry = document.createElement('td');
    buck_bef_entry.setAttribute("id", ledger_id + "-bucket-before");
    buck_bef_entry.innerHTML = formatter.format(transaction.bucket_before);

    var buck_aft_entry = document.createElement('td');
    buck_aft_entry.setAttribute("id", ledger_id + "-bucket-after");
    buck_aft_entry.innerHTML = formatter.format(transaction.bucket_after);

    // Add values to entry
    entry.appendChild(date_entry);
    entry.appendChild(bucket_entry);
    entry.appendChild(desc_entry);
    entry.appendChild(value_entry);
    entry.appendChild(buck_bef_entry);
    entry.appendChild(buck_aft_entry);

    // Edit and remove buttons won't show on bucket name change transactions
    if (!(transaction.date == "" && transaction.value == 0)) {
      var edit_button = document.createElement('td');
      edit_button.innerHTML = "<button class='transaction-edit' onclick='editTransaction(\"" + ledger_id + "\",this)'>Edit</button>"

      var remove_button = document.createElement('td');
      remove_button.innerHTML = "<button class='transaction-remove' onclick='removeTransaction(\"" + ledger_id + "\")'>Remove</button>"
      entry.appendChild(edit_button);
      entry.appendChild(remove_button);
    }

    // Add entry to table
    table.appendChild(entry);
  }

  // Empty new transaction fields
  var input_fields = ["date", "bucket", "desc", "value"];
  for (var i = 0; i < input_fields.length; i++) {
    document.getElementById(input_fields[i] + "-input").value = "";
  }

}

function sortLedgerTable(field, asc, sort_button) {
  if (asc) {
    sort_button.setAttribute("onclick", sort_button.getAttribute("onclick").replace("true", "false"));
  } else {
    sort_button.setAttribute("onclick", sort_button.getAttribute("onclick").replace("false", "true"));
  }

  BUDGET.setLedgerSortParams(field, asc);
  BUDGET.sortLedger();
  updateLedgerTable();
}

function addTransaction() {
  // Get each field for transaction
  var transaction_date = document.getElementById("date-input").value;
  var transaction_bucket = document.getElementById("bucket-input").value;
  var transaction_desc = document.getElementById("desc-input").value;
  var transaction_value = Number(document.getElementById("value-input").value);
  if (transaction_date == "") {
    alert("Please select a date for the transaction");
    return;
  }
  if (transaction_bucket == "") {
    alert("Please select a bucket for the transaction");
    return;
  }
  if (transaction_desc == "") {
    alert("Please add a description for the transaction");
    return;
  }
  if (transaction_value == "") {
    alert("Please add a numeric value for the transaction");
    return;
  } else if (transaction_value > Number.MAX_SAFE_INTEGER) {
    alert("You have added a transaction with a value higher than JavaScript " +
      "can handle without precision errors. Please use a smaller value.");
    return;
  }


  // Add the transaction to the ledger
  var success = BUDGET.addTransaction(transaction_date, transaction_bucket,
    transaction_desc, transaction_value);

  // Update ledger table
  updateLedgerTable();
  // Update bucket table
  updateBucketTable();
}

function removeTransaction(transaction_id) {
  // Remove transaction
  BUDGET.removeTransaction(transaction_id);

  // Propogate changes to visual ledger
  updateLedgerTable();

  // Propogate changes to bucket table
  updateBucketTable();
}

function editTransaction(transaction_id, edit_button) {
  // Get cells for the transaction and change them to input fields
  var date_cell = document.getElementById(transaction_id + "-date");
  var date_cell_inner = date_cell.innerHTML;
  date_cell.innerHTML = "<input id='" + transaction_id + "-date_edit' type='date' old_value='" + date_cell_inner + "' Value='" + date_cell_inner + "'>";

  var bucket_cell = document.getElementById(transaction_id + "-bucket");
  var bucket_cell_value = bucket_cell.innerHTML;
  var bucket_select_options = document.getElementById("bucket-input").innerHTML.replace(">" + bucket_cell_value, "selected='true'>" + bucket_cell_value);
  var bucket_cell_inner = "<select id='" + transaction_id + "-bucket_edit' old_value='" + bucket_cell_value + "' Value='" + bucket_cell_value + "'>";
  bucket_cell.innerHTML = bucket_cell_inner + bucket_select_options + "</select>";

  var desc_cell = document.getElementById(transaction_id + "-description");
  var desc_cell_inner = desc_cell.innerHTML;
  desc_cell.innerHTML = "<input id='" + transaction_id + "-description_edit' type='text' old_value='" + desc_cell_inner + "' Value='" + desc_cell_inner + "'>";

  var value_cell = document.getElementById(transaction_id + "-value");
  var value_cell_inner = value_cell.innerHTML.replace("$", "");
  value_cell.innerHTML = "<input id='" + transaction_id + "-value_edit' type='number' step='0.01' old_value='" + Number(value_cell_inner) + "' Value='" + Number(value_cell_inner) + "'>";

  // Add cancel button under input field
  var cancel_button = document.createElement("button")
  cancel_button.setAttribute("id", transaction_id + "_cancel");
  cancel_button.setAttribute("onclick", "cancelTransactionEdit(\"" + transaction_id + "\",this)");
  cancel_button.innerHTML = "Cancel";
  edit_button.parentElement.appendChild(cancel_button);

  // Change this button to Submit Changes
  edit_button.setAttribute("id", transaction_id + "_submit");
  edit_button.setAttribute("onclick", "confirmTransactionEdit(\"" + transaction_id + "\")");
  edit_button.innerHTML = "Submit Changes";
}

function cancelTransactionEdit(transaction_id, cancel_button) {
  // Replace inputs with the display values
  var date_cell = document.getElementById(transaction_id + "-date");
  var bucket_cell = document.getElementById(transaction_id + "-bucket");
  var desc_cell = document.getElementById(transaction_id + "-description");
  var value_cell = document.getElementById(transaction_id + "-value");

  date_cell.innerHTML = date_cell.children[0].getAttribute("old_value");
  bucket_cell.innerHTML = bucket_cell.children[0].getAttribute("old_value");
  desc_cell.innerHTML = desc_cell.children[0].getAttribute("old_value");
  value_cell.innerHTML = formatter.format(value_cell.children[0].getAttribute("old_value"));


  // Switch Submit Changes button back to Edit
  var submit_button = document.getElementById(transaction_id + "_submit");
  submit_button.removeAttribute("id");
  submit_button.setAttribute("onclick", "editTransaction(\"" + transaction_id + "\",this)")
  submit_button.innerHTML = "Edit";

  // Remove cancel button
  cancel_button.remove();
}

function confirmTransactionEdit(transaction_id) {
  // Get each field for transaction
  var new_transaction_date = document.getElementById(transaction_id + "-date").children[0].value;
  var new_transaction_bucket = document.getElementById(transaction_id + "-bucket").children[0].value;
  new_transaction_bucket = new_transaction_bucket.toLowerCase().replaceAll(" ", "_");
  var new_transaction_desc = document.getElementById(transaction_id + "-description").children[0].value;
  var new_transaction_value = Number(document.getElementById(transaction_id + "-value").children[0].value);
  if (new_transaction_date == "") {
    alert("Please select a date for the transaction");
    return;
  }
  if (new_transaction_bucket == "") {
    alert("Please select a bucket for the transaction");
    return;
  }
  if (new_transaction_desc == "") {
    alert("Please add a description for the transaction");
    return;
  }
  if (new_transaction_value == "") {
    alert("Please add a numeric value for the transaction");
    return;
  } else if (new_transaction_value > Number.MAX_SAFE_INTEGER) {
    alert("You have added a transaction with a value higher than JavaScript " +
      "can handle without precision errors. Please use a smaller value.");
    return;
  }

  BUDGET.editTransaction(new_transaction_date, new_transaction_bucket, new_transaction_desc, new_transaction_value, transaction_id);

  // Update bucket list
  updateBucketTable();

  // Update ledger items associated with changed bucket
  updateLedgerTable();
}