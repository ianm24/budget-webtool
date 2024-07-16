//===========================
// BACKEND CLASSES/FUNCTIONS
//===========================
class Bucket {
  constructor(display_name,value) {
    this.display_name = display_name;
    this.value = value;
  }

  modifyValue(value_modifier) {
    this.value += value_modifier;
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
      this.value = value;
      this.bucket_before = bucket_before;
      this.bucket_after = this.bucket_before + this.value;
    }
}

class TransactionList {
  constructor() {
    this.bucket_transaction_id = 0;
    this.bucket_transactions = {};
  }

  addTransaction(transaction) {
    this.bucket_transactions[this.bucket_transaction_id] = transaction;
    this.bucket_transaction_id++;
    return this.bucket_transaction_id - 1;
  }

  removeTransaction(bucket_transaction_id) {
    delete this.bucket_transactions[bucket_transaction_id];
  }

  // updateBucketName(new_bucket_id) {
  //   for(var bt_id in this.bucket_transactions) {
  //     this.bucket_transactions[bt_id].bucket = new_bucket_id;
  //   }
  // }
}

class Ledger {
  constructor() {
    this.transaction_lists = {};
    // Dictionary of transaction_id to bucket and bucket_transaction_id
    this.page_table = {};
    this.id_counter = 0;
  }

  addTransaction(transaction) {
    // If list for this bucket's transactions doesnt exist, make it
    if(this.transaction_lists[transaction.bucket] == null) {
      this.transaction_lists[transaction.bucket] = new TransactionList();
    }

    // Set up page table entry and add to bucket transactions
    var bt_id = this.transaction_lists[transaction.bucket].addTransaction(transaction);
    this.page_table[this.id_counter] = [transaction.bucket,bt_id];

    // Update ledger id counter
    this.id_counter++;
  }

  removeTransaction(ledger_id) {
    // Remove transaction from its bucket
    var page = this.page_table[ledger_id];
    this.transaction_lists[page[0]].removeTransaction(page[1]);

    // Remove page table entry
    delete this.page_table[ledger_id];
  }

  // TODO update this for page table
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
    this.items[ledger_id] = new_transaction;
    return true;
  }

  updateBucketName(bucket,new_bucket_id, new_bucket_name) {

    // Add transaction in bucket to indicate changed name
    var bucket_name = bucket.display_name;
    var bucket_id = bucket_name.toLowerCase().replaceAll(" ","_");
    var bucket_val = bucket.value;

    var name_change_transaction = new Transaction(
      this.id_counter,"",bucket_id,
      "Bucket name change from \""+bucket_name + "\" to \"" +
      new_bucket_name+"\"",0,bucket_val
    );
    var bt_id = this.transaction_lists[bucket_id].addTransaction(name_change_transaction);
    this.page_table[this.id_counter] = [bucket_id,bt_id];
    this.id_counter++;

    // update bucket key in transaction list but keep old bucket
    Object.defineProperty(this.transaction_lists, new_bucket_id, Object.getOwnPropertyDescriptor(this.transaction_lists, bucket_id));
    delete this.transaction_lists[bucket_id];    

    // update entries in page table
    for(var page_id in this.page_table) {
      if(this.page_table[page_id][0] == bucket_id) {
        this.page_table[page_id][0] = new_bucket_id;
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

  addTransaction(date, bucket, description, value) {
    var transaction = new Transaction(this.ledger.id_counter,
      date, bucket, description, value,
      this.buckets[bucket].value
    );
    
    this.buckets[bucket].value += value;
    this.ledger.addTransaction(transaction);
    return true;
  }
}

// ==================
// FUNCTIONS FOR HTML
// ==================

var BUDGET = new Budget();
//TODO add customizable formatters for different currencies
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

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

// TODO have it display in reverse adding order within date value
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
  var rev_page_ids = Object.keys(BUDGET.ledger.page_table).reverse();
  // Add transactions
  for(var i = 0; i < rev_page_ids.length; i++) {
    var page_id = rev_page_ids[i];
    var page = BUDGET.ledger.page_table[page_id];
    var transaction = BUDGET.ledger.transaction_lists[page[0]].bucket_transactions[page[1]];

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
    desc_entry.setAttribute("id",page_id);
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
      edit_button.innerHTML = "<button class='transaction-edit' onclick='editTransaction(\""+page_id+"\",this)'>Edit</button>"

      var remove_button = document.createElement('td');
      remove_button.innerHTML = "<button class='transaction-remove' onclick='removeTransaction(\""+page_id+"\")'>Remove</button>"
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
  }
  

  // Add the transaction to the ledger
  var success = BUDGET.addTransaction(transaction_date,transaction_bucket,
    transaction_desc, transaction_value);
  
  // Update ledger table
  updateLedgerTable();
  // Update bucket table
  updateBucketTable();
}

// TODO
function removeTransaction(transaction_id) {
  
}

// TODO
function editTransaction(transaction_id) {
  
}