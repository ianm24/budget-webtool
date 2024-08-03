//===========================
// BACKEND CLASSES/FUNCTIONS
//===========================

//===Start Budget Classes===
class Bucket {
  constructor(display_name,value) {
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
}

class Ledger {
  constructor() {
    this.transactions = {};
    this.id_counter = 0;
  }

  addTransaction(transaction) {
    var ledger_id = "_"+transaction.id;
    this.transactions[ledger_id] = transaction;

    // Update ledger id counter
    this.id_counter++;
  }

  // Returns the new bucket value after updating all ledger transactions in the removed transaction's bucket
  removeTransaction(ledger_id) {
    // Update all transactions in the corresponding bucket
    var transaction = this.transactions[ledger_id];
    var target_bucket = transaction.bucket;

    // get the transaction in this bucket before this and note its bucket after
    var ledger_ids = Object.keys(this.transactions);
    var ledger_id_key_idx = ledger_ids.indexOf(ledger_id);

    // If a previous transaction in this bucket isn't found, this is the first
    var before_id = ledger_id;
    var new_bucket_before = 0;

    // Assumes ledger is sorted by id in descending order
    for(var i = ledger_id_key_idx+1; i < ledger_ids.length; i++) {
      var curr_ledger_id = ledger_ids[i];
      var transaction = this.transactions[curr_ledger_id];

      if(transaction.bucket == target_bucket) {
        before_id = curr_ledger_id;
        new_bucket_before = transaction.bucket_after;
        break;
      }
    }
    
    // Get the transaction in this bucket after this and set its before to the other's after
    var after_id = ledger_id;
    
    // Assumes ledger is sorted by id in descending order
    for(var i = ledger_id_key_idx-1; i > 0; i--) {
      var curr_ledger_id = ledger_ids[i];
      var transaction = this.transactions[curr_ledger_id];

      if(transaction.bucket == target_bucket) {
        after_id = curr_ledger_id;
        transaction.bucket_before = new_bucket_before;
        break;
      }
    }
    
    // update the rest of the transactions in this bucket
    var new_bucket_val = this.updateLedger(after_id);

    // Delete transaction
    delete this.transactions[ledger_id];

    //return the new value of the bucket
    return new_bucket_val;
  }

  editTransaction(ledger_id, new_transaction) {
    var old_transaction = this.items[ledger_id];
    if(new_transaction.bucket != old_transaction.bucket ||
      new_transaction.value != old_transaction.value ||
      new_transaction.bucket_before != old_transaction.bucket_before
    ) {
      // TODO handle bucket, value, and before bucket changes
      //Bucket change
      //  old bucket 
      //    set next transaction's before val to the removed before val
      //    repeat until all transactions after removal are updated
      //    update old bucket's value
      //  new bucket
      //    find where transaction fits
      //      go through bucket transactions until you find one with id after removed
      //    get transaction with bt_id before this and set removed's bucket before and after accordingly
      //    set transaction with id after removed's bucket before to removed's after and increase bt_id by 1; update page table entries
      //      repeat until all transaction ids and bucket before/after values have been updated
      //    update new bucket's value    
      //  remove transaction from old bucket list
      //  add transaction to its index in the new bucket list
      //  update page table entry 
      //Value change
      //Before Value change
      return false;
    }
    this.transactions[ledger_id] = new_transaction;
    return true;
  }

  // asc: true is sort should be in ascending order, false if descending
  // First sorts by the chosen field, then by transaction ID
  sortLedger(field,asc) {
    var existing_transactions = this.transactions;
    switch(field) {
      case "id":        
        this.transactions = Object.fromEntries(
          // (-1)^(1+asc) * a + (-1)^(asc) * b = {a-b if asc=true; b-a if asc=false}
          Object.entries(existing_transactions).sort(function (a,b) { 
            return Math.pow(-1,1+asc)*a[1][field] + Math.pow(-1,asc)*b[1][field];
          })
        );
        break;
      case "bucket":
        this.transactions = Object.fromEntries(
          Object.entries(existing_transactions).sort(function (a,b) {
            var id_sort_val = Math.pow(-1,1+asc)*a[1]["id"] + Math.pow(-1,asc)*b[1]["id"];
            if(a[1][field] < b[1][field]) {
              var bucket_sort_val = -1*Math.pow(-1,1+asc);
              return bucket_sort_val + id_sort_val;
            }
            if(b[1][field] < a[1][field]) {
              var bucket_sort_val = 1*Math.pow(-1,1+asc);
              return bucket_sort_val + id_sort_val;
            }
            return 0;
          })
        );
        break;
      case "date":
        this.transactions = Object.fromEntries(
          Object.entries(existing_transactions).sort(function (a,b) {
            var date_a = new Date(a[1][field]);
            var date_b = new Date(b[1][field]);
            var date_sort_val = Math.pow(-1,1+asc)*date_a + Math.pow(-1,asc)*date_b;
            var id_sort_val = Math.pow(-1,1+asc)*a[1]["id"] + Math.pow(-1,asc)*b[1]["id"];
            return date_sort_val + id_sort_val;
          })
        );
    }
  }

  // Returns the new bucket value after updating all ledger transactions in that bucket
  updateLedger(ledger_id) {
    // Starting at ledger_id, update every transaction in that bucket with new bucket_before
    var transaction = this.transactions[ledger_id];
    var target_bucket = transaction.bucket;
    var curr_bucket_before = transaction.bucket_before;
    var curr_bucket_val = 0;

    var ledger_ids = Object.keys(this.transactions);
    // Assumes ledger is sorted by id in descending order
    for(var i = ledger_ids.indexOf(ledger_id); i >= 0; i--) {
      var curr_ledger_id = ledger_ids[i];
      var transaction = this.transactions[curr_ledger_id];
      
      if(transaction.bucket != target_bucket) {
        continue;
      }

      transaction.bucket_before = curr_bucket_before;
      transaction.bucket_after = Number((transaction.bucket_before + transaction.value).toFixed(2));
      curr_bucket_before = transaction.bucket_after;
      curr_bucket_val = transaction.bucket_after;
    }

    return curr_bucket_val;
  }

  updateBucketName(bucket,new_bucket_id, new_bucket_name) {

    // Add transaction in bucket to indicate changed name
    var bucket_name = bucket.display_name;
    var bucket_id = bucket_name.toLowerCase().replaceAll(" ","_");
    var bucket_val = bucket.value;

    var ledger_id = "_"+this.id_counter;
    var name_change_transaction = new Transaction(
      ledger_id,"",new_bucket_id,
      "Bucket name change from \""+bucket_name + "\" to \"" +
      new_bucket_name+"\"",0,bucket_val
    );
    this.transactions[ledger_id] = name_change_transaction;
    this.id_counter++;
    
    // Update all transactions in the old bucket to the new bucket name
    for(var ledger_id in this.transactions) {
      var transaction = this.transactions[ledger_id];
      if(transaction.bucket == bucket_id) {
        transaction.bucket = new_bucket_id;
      }
    }
  }
}

const valid_sort_fields = ["id","date","bucket"]
class Budget {
  constructor() {
    // Dictionary of bucket ids and objects
    this.buckets = {};
    this.ledger = new Ledger();
    this.sort_field = "date";
    this.sort_dir_asc = false;
  }

  addBucket(name, value) {
    var new_bucket = new Bucket(name,value);
    var bucket_id = name.toLowerCase().replaceAll(" ","_");
    if(this.buckets[bucket_id] != null) {
      // Can't have duplicate buckets
      return false;
    }
    this.buckets[bucket_id] = new_bucket;
    return true;
  }

  removeBucket(bucket_id) {
    if(this.buckets[bucket_id] == null) {
      // Can't remove nonexistent buckets
      return false;
    }
    delete this.buckets[bucket_id];
    return true;
  }

  editBucket(bucket_id, new_bucket_name) {
    var new_bucket_id = new_bucket_name.toLowerCase().replaceAll(" ","_");
    if(this.buckets[new_bucket_id] != null) {
      // Can't have duplicate buckets
      return false;
    }

    // Update bucket name in ledger
    this.ledger.updateBucketName(this.buckets[bucket_id],new_bucket_id, new_bucket_name);

    // Update key and display name (using defineProperty preserves order of buckets)
    Object.defineProperty(this.buckets, new_bucket_id, Object.getOwnPropertyDescriptor(this.buckets, bucket_id));
    this.buckets[new_bucket_id].display_name = new_bucket_name;
    delete this.buckets[bucket_id];

    return true;
  }

  //TODO if transaction from older date is added, sort by date and put this at the end of that date, then update bucket vals
  addTransaction(date, bucket, description, value) {
    var transaction = new Transaction(this.ledger.id_counter,
      date, bucket, description, Number(value.toFixed(2)),
      this.buckets[bucket].value
    );
    
    this.buckets[bucket].value = Number((this.buckets[bucket].value + value).toFixed(2));
    this.ledger.addTransaction(transaction);
    return true;
  }

  removeTransaction(transaction_id) {
    var transaction = this.ledger.transactions[transaction_id];
    var target_bucket = transaction.bucket;

    if(this.sort_field == "id" && this.sort_dir_asc == false) {
      this.buckets[target_bucket].value = this.ledger.removeTransaction(transaction_id);
      return true;
    }

    // If needed, sort ledger by descending id before removal then use previous sort method after
    var curr_sort_field = this.sort_field;
    var curr_sort_dir_asc = this.sort_dir_asc;
    this.sort_field = "id";
    this.sort_dir_asc = false;

    // Yes I know sorting twice is inefficient but for the scale of a personal budget,
    // It shouldn't affect performance too much (my current paper ledger has ~5000 entries for the past 5 years)
    this.sortLedger();
    this.buckets[target_bucket].value = this.ledger.removeTransaction(transaction_id);

    this.sort_field = curr_sort_field;
    this.sort_dir_asc = curr_sort_dir_asc;
    this.sortLedger();
    return true;
  }

  sortLedger() {
    // if(!this.valid_sort_fields.includes(field)) {
    //   return false;
    // }
    this.ledger.sortLedger(this.sort_field, this.sort_dir_asc);
    return true;
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
  if(!object.buckets) {
    invalid_JSON = true;
  } else {
    var bucket_keys = Object.keys(object.buckets);
    for(var i = 0; i < bucket_keys.length; i++) {
      var curr_bucket = object.buckets[bucket_keys[i]];
      var name = "";
      var val = 0;

      // Bucket input validation
      if(curr_bucket.display_name == null || typeof(curr_bucket.display_name) != "string") {
        invalid_JSON = true;
        name = "INVALID_JSON_BUCKET_"+i;
      } else {
        name = curr_bucket.display_name;
      }

      if(curr_bucket.value == null || typeof(curr_bucket.value) != "number") {
        invalid_JSON = true;
        val = 0
      } else {
        val = curr_bucket.value;
      }
      var success = imported_budget.addBucket(name,val);
      if(!success) {
        invalid_JSON = true;
        imported_budget.addBucket("INVALID_JSON_BUCKET_"+i,val);
      }
    }
  }
  

  // Sort input validation
  if(object.sort_field == null || typeof(object.sort_field) != "string" ||
    !valid_sort_fields.includes(object.sort_field)) {

    invalid_JSON = true;
    imported_budget.sort_field = valid_sort_fields[0];
  } else {
    imported_budget.sort_field = object.sort_field;
  }

  if(object.sort_dir_asc == null || typeof(object.sort_dir_asc) != "boolean") {
    invalid_JSON = true;
    imported_budget.sort_dir_asc = false;
  } else {
    imported_budget.sort_dir_asc = object.sort_dir_asc;
  }

  // Ledger input validation
  if(!object.ledger || !object.ledger.transactions) {
    invalid_JSON = true;
  } else {
    // check that each transaction has the required fields (even if empty)
    var invalid_id_counter = 0;
    var max_id = 0;
    var imported_transactions = {};
    var import_ledger_keys = Object.keys(object.ledger.transactions);
    for(var i = 0; i < import_ledger_keys.length; i++) {
      var curr_transaction = object.ledger.transactions[import_ledger_keys[i]];
      var curr_id = invalid_id_counter;
      var curr_date = "0001-01-01";
      var curr_bucket = "INVALID_JSON_TRANSACTION_BUCKET";
      var curr_bucket_before = 0;
      var curr_val = 0;
      var curr_desc = "INVALID_JSON_DESCRIPTION";

      if(curr_transaction.id == null || typeof(curr_transaction.id) != "number") {
        invalid_JSON = true;
        invalid_id_counter++;
      } else {
        curr_id = curr_transaction.id;
        max_id = Math.max(max_id,curr_id);
      }

      //Check Date
      if(curr_transaction.date == null || typeof(curr_transaction.date) != "string" 
      || curr_transaction.date.match("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]") == null) {
        invalid_JSON = true;
      } else {
        curr_date = curr_transaction.date;
      }

      // Check bucket
      if(curr_transaction.bucket == null || typeof(curr_transaction.bucket) != "string") {
        invalid_JSON = true;
      } else if (Object.keys(imported_budget.buckets).indexOf(curr_transaction.bucket)) {
        invalid_JSON = true;
        curr_bucket = curr_transaction.bucket;
      } else {
        curr_bucket = curr_transaction.bucket;
      }

      // Check Bucket before
      if(curr_transaction.bucket_before == null || typeof(curr_transaction.bucket_before) != "number") {
        invalid_JSON = true;
      } else {
        curr_bucket_before = curr_transaction.bucket_before;
      }

      // Check value
      if(curr_transaction.value == null || typeof(curr_transaction.value) != "number") {
        invalid_JSON = true;
      } else {
        curr_val = curr_transaction.value;
      }

      // Check description
      if(curr_transaction.description == null || typeof(curr_transaction.description) != "string") {
        invalid_JSON = true;
      } else {
        curr_desc = curr_transaction.description;
      }

      imported_transactions[import_ledger_keys[i]] = new Transaction(curr_id,curr_date,curr_bucket,
        curr_desc,curr_val,curr_bucket_before)
    }
    imported_budget.ledger.transactions = imported_transactions;

    // Check id_counter
    if(object.ledger.id_counter == null || typeof(object.ledger.id_counter) != "number" ||
    object.ledger.id_counter < max_id+invalid_id_counter) {
      invalid_JSON = true;
      imported_budget.ledger.id_counter = max_id+invalid_id_counter;
    } else {
      imported_budget.ledger.id_counter = object.ledger.id_counter;
    }
    
  }
  

  BUDGET = imported_budget;
}


var exportDataFile = null;
function exportJSON(budget) {
  const data = new Blob([JSON.stringify(budget)], {type: "application/json"});

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
  if(files.length != 1) {
    alert("Please upload one data file before trying to import.");
    return;
  }

  var file = files[0];
  var file_type = file.type;
  if(!valid_file_import_types.includes(file_type)) {
    alert("Please upload an accepted file type: ["+valid_file_import_types+"].");
  }

  // Make promise to ensure data is read from file before being used in import functions
  var file_read_promise = new Promise(function(resolve,reject) {
    var reader = new FileReader();

    switch(file_type) {
      case 'application/json':
        //Wait until read finished before importing data
        reader.onloadend = function() {
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
    function() {
      updateBucketTable();
      updateLedgerTable();
    },
    function(error) {
      alert(error);
    }
  );
}

function exportData(filetype) {
  // Set object URL for the current budget
  switch(filetype) {
    case 'json':
      exportJSON(BUDGET);
      break;
    // TODO allow csv export
  }

  // Click the object URL link to download
  var link = document.createElement('a');
  link.setAttribute('download', 'budget.'+filetype);
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
  
  for(var i = 0; i < header_labels.length; i++) {
    var cell = document.createElement('th');
    cell.innerHTML = header_labels[i];
    header.appendChild(cell);
  }
  table.appendChild(header);

  

  // Add buckets
  for(var bucket_id in BUDGET.buckets) {
    var entry = document.createElement('tr');
    var bucket = BUDGET.buckets[bucket_id];

    // Entry values
    var name_entry = document.createElement('td');
    name_entry.setAttribute("id",bucket_id);
    name_entry.innerHTML = bucket.display_name;

    var value_entry = document.createElement('td');  
    value_entry.innerHTML = formatter.format(bucket.value);

    // Edit and remove buttons
    var edit_button = document.createElement('td');
    edit_button.innerHTML = "<button class='bucket-edit' onclick='editBucket(\""+bucket_id+"\",this)'>Edit</button>"

    var remove_button = document.createElement('td');
    remove_button.innerHTML = "<button class='bucket-remove' onclick='removeBucket(\""+bucket_id+"\")'>Remove</button>"

    // Add to table
    entry.appendChild(name_entry);
    entry.appendChild(value_entry);
    entry.appendChild(edit_button);
    entry.appendChild(remove_button);
    table.appendChild(entry);

    // Update transaction bucket selector
    var select_option = document.createElement('option');
    select_option.setAttribute("value",bucket_id);
    select_option.innerHTML = bucket.display_name;

    select.appendChild(select_option);
  }

  // Empty new bucket fields
  document.getElementById("new-bucket-name").value = "";

}

function addBucket() {
  var new_bucket_name = document.getElementById("new-bucket-name").value;
  if(new_bucket_name == "") {
    alert("Please enter a name for the new bucket.");
    return;
  }
  var success = BUDGET.addBucket(new_bucket_name,0);

  // If bucket already exists, alert user
  if(!success) {
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
function editBucket(bucket_id,edit_button) {
  // Get cell that bucket name is in and change to input field
  var cell = document.getElementById(bucket_id);
  var curr_cell_inner = cell.innerHTML;
  cell.innerHTML = "<input id='"+bucket_id+"_edit' type='text' Value='"+curr_cell_inner+"'>";

  // Add cancel button under input field
  cell.innerHTML += "<button id='"+bucket_id+"_cancel' onclick='cancelBucketEdit(\""+bucket_id+"\",this)'>Cancel</button>";

  // Change this button to Submit Changes
  edit_button.setAttribute("id",bucket_id+"_submit");
  edit_button.setAttribute("onclick","confirmBucketEdit(\""+bucket_id+"\",this)");
  edit_button.innerHTML = "Submit Changes";  
}

function cancelBucketEdit(bucket_id,cancel_button) {
  // Replace input with plane-text of the bucket's display name
  var cell = document.getElementById(bucket_id);
  cell.innerHTML = BUDGET.buckets[bucket_id].display_name;

  // Switch Submit Changes button back to Edit
  var submit_button = document.getElementById(bucket_id+"_submit");
  submit_button.removeAttribute("id");
  submit_button.setAttribute("onclick","editBucket(\""+bucket_id+"\",this)")
  submit_button.innerHTML = "Edit";

  // Remove cancel button
  cancel_button.remove();
}

function confirmBucketEdit(bucket_id,confirm_button) {
  // Check if new bucket name is valid, if not, give alert
  var new_bucket_name = document.getElementById(bucket_id+"_edit").value;
  var success = BUDGET.editBucket(bucket_id,new_bucket_name);
  if(!success) {
    alert("New bucket name too similar to existing bucket name.");
    return;
  }
  // Update bucket list
  updateBucketTable();

  // Update ledger items associated with changed bucket
  updateLedgerTable();
}

// TODO have a way for user to decide between sorting by id, date, bucket in asc or desc
function updateLedgerTable() {
  // Empty table
  var table = document.getElementById("ledger-table");
  table.innerHTML = "";

  // Add header
  var header_labels = ["Date", "Bucket", "Description",
    "Value", "Bucket Value Before", "Bucket Value After"];
  var header = document.createElement('tr');
  
  for(var i = 0; i < header_labels.length; i++) {
    var cell = document.createElement('th');
    cell.innerHTML = header_labels[i];
    header.appendChild(cell);
  }
  table.appendChild(header);

  // Get transactions in reverse order added
  BUDGET.sortLedger();
  
  // Add transactions
  for(var ledger_id in BUDGET.ledger.transactions) {
    var transaction = BUDGET.ledger.transactions[ledger_id];

    var entry = document.createElement('tr');

    // Entry values
    var date_entry = document.createElement('td');
    date_entry.innerHTML = transaction.date;
    
    var bucket_entry = document.createElement('td');
    // If bucket name has changed, display id
    if(BUDGET.buckets[transaction.bucket] == null) {
      bucket_entry.innerHTML = transaction.bucket;
    } else {
      bucket_entry.innerHTML = BUDGET.buckets[transaction.bucket].display_name;
    }

    var desc_entry = document.createElement('td');
    desc_entry.setAttribute("id",ledger_id);
    desc_entry.innerHTML = transaction.description;

    var value_entry = document.createElement('td');  
    value_entry.innerHTML = formatter.format(transaction.value);

    var buck_bef_entry = document.createElement('td');  
    buck_bef_entry.innerHTML = formatter.format(transaction.bucket_before);

    var buck_aft_entry = document.createElement('td');  
    buck_aft_entry.innerHTML = formatter.format(transaction.bucket_after);

    // Add values to entry
    entry.appendChild(date_entry);
    entry.appendChild(bucket_entry);
    entry.appendChild(desc_entry);
    entry.appendChild(value_entry);
    entry.appendChild(buck_bef_entry);
    entry.appendChild(buck_aft_entry);

    // Edit and remove buttons won't show on bucket name change transactions
    if(!(transaction.date == "" && transaction.value == 0)) {
      var edit_button = document.createElement('td');
      edit_button.innerHTML = "<button class='transaction-edit' onclick='editTransaction(\""+ledger_id+"\",this)'>Edit</button>"

      var remove_button = document.createElement('td');
      remove_button.innerHTML = "<button class='transaction-remove' onclick='removeTransaction(\""+ledger_id+"\")'>Remove</button>"
      entry.appendChild(edit_button);
      entry.appendChild(remove_button);
    }

    // Add entry to table
    table.appendChild(entry);
  }

  // Empty new transaction fields
  var input_fields = ["date","bucket","desc","value"];
  for(var i = 0; i < input_fields.length; i++) {
    document.getElementById(input_fields[i]+"-input").value = "";
  }

}

function addTransaction() {
  // Get each field for transaction
  var transaction_date = document.getElementById("date-input").value;
  var transaction_bucket = document.getElementById("bucket-input").value;
  var transaction_desc = document.getElementById("desc-input").value;
  var transaction_value = Number(document.getElementById("value-input").value);
  if(transaction_date == "") {
    alert("Please select a date for the transaction");
    return;
  }
  if(transaction_bucket == "") {
    alert("Please select a bucket for the transaction");
    return;
  }
  if(transaction_desc == "") {
    alert("Please add a description for the transaction");
    return;
  }
  if(transaction_value == "") {
    alert("Please add a numeric value for the transaction");
    return;
  } else if (transaction_value > Number.MAX_SAFE_INTEGER) {
    alert("You have added a transaction with a value higher than JavaScript "+
      "can handle without precision errors. Please use a smaller value.");
    return;
  }
  

  // Add the transaction to the ledger
  var success = BUDGET.addTransaction(transaction_date,transaction_bucket,
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

// TODO
function editTransaction(transaction_id) {
  
}