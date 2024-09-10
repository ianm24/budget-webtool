/** @module BucketBudget */

//===Start Budget-related Classes===

/**
 * Holds a budget bucket's name and value.
 * @module module:BucketBudget~Bucket
 * @class
 */
class Bucket {
  /**
   * Bucket Constructor
   * @param {string} display_name - Name of the bucket.
   * @param {number} value - Value (amount of money) in the bucket rounded to 2 decimal places.
   */
  constructor(display_name, value) {
    /**
     * Name of the bucket.
     * @member {string} display_name
     * @memberof module:BucketBudget~Bucket
     * @instance
     */
    this.display_name = display_name;

    /**
     * Value (amount of money) in the bucket rounded to 2 decimal places.
     * @member {number} value
     * @memberof module:BucketBudget~Bucket
     * @instance
     */
    this.value = Number(value.toFixed(2));
  }

  /**
   * Modifies a bucket's value.
   * @param {number} value_modifier - How much money is being added or removed from the bucket.
   */
  modifyValue(value_modifier) {
    var new_val = Number((this.value + value_modifier).toFixed(2));
    this.value = new_val;
  }
}

/**
 * Holds identifying and descriptive information about a ledger transaction.
 * @module BucketBudget~Transaction
 * @class
 */
class Transaction {
  /**
   * Transaction Constructor
   * @param {number} id - Identifying number for the transaction.
   * @param {string} date - Date the transaction occurred in YYYY-MM-DD format.
   * @param {string} bucket - The bucket this transaction is in. Budget.buckets is used to get the Bucket object associated with this.
   * @param {string} description - Description of the transaction. Generally 128 characters or shorter.
   * @param {number} value - Value of the transaction rounded to 2 decimal places.
   * @param {number} bucket_before - Value of the associated bucket prior to this transaction.
   */
  constructor(id, date, bucket,
    description, value,
    bucket_before) {
    /**
     * Identifying number for the transaction.
     * @member {number} id
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.id = id;

    /**
     * Date the transaction occurred in YYYY-MM-DD format.
     * @member {string} date
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.date = date;

    /**
     * The bucket this transaction is in. Budget.buckets is used to get the Bucket object associated with this.
     * @member {string} bucket
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.bucket = bucket;

    /**
     * Description of the transaction. Generally 128 characters or shorter.
     * @member {string} description
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.description = description;

    /**
     * Value of the transaction rounded to 2 decimal places.
     * @member {number} value
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.value = Number(value.toFixed(2));

    /**
     * Value of the associated bucket prior to this transaction.
     * @member {number} bucket_before
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.bucket_before = Number(bucket_before.toFixed(2));

    /**
     * Value of the associated bucket after this transaction.
     * @member {number} bucket_after
     * @memberof module:BucketBudget~Transaction
     * @instance
     */
    this.bucket_after = Number((this.bucket_before + this.value).toFixed(2));
  }

  /**
   * Returns comparison of transactions by a numerical field.
   * (-1)^(1+asc) * a + (-1)^(asc) * b = {a-b if asc=true; b-a if asc=false}
   * @param {Transaction} a - First Transaction to compare fields.
   * @param {Transaction} b - Second Transaction to compare fields.
   * @param {boolean} asc - True if comparison is ascending, false otherwise.
   * @param {string} field - Numeric field to sort by.
   * @returns {number} Numerical sort value that is negative if a < b, 0 if a=b, positive if a > b (pos and neg switch if asc is false).
   */
  static numericCompare(a, b, asc, field) {
    return Math.pow(-1, 1 + asc) * a[field] + Math.pow(-1, asc) * b[field];
  }

  /**
   * Returns comparison of transaction dates and ids.
   * @param {Transaction} a - First Transaction to compare dates.
   * @param {Transaction} b - Second Transaction to compare dates.
   * @param {boolean} asc - True if comparison is ascending, false otherwise.
   * @returns {number} Numerical sort value that is negative if a < b, 0 if a=b, positive if a > b (pos and neg switch if asc is false).
   */
  static dateCompare(a, b, asc) {
    var date_a = new Date(a.date);
    var date_b = new Date(b.date);

    // Get date and id sort values based on ascending or descending sort.
    var date_sort_val = Math.pow(-1, 1 + asc) * date_a + Math.pow(-1, asc) * date_b;
    var id_sort_val = Math.pow(-1, 1 + asc) * a.id + Math.pow(-1, asc) * b.id;

    // For bucket renames, ignore date
    if (a.date == "" || b.date == "") {
      date_sort_val = 0;
    }
    return date_sort_val + id_sort_val;
  }

  /**
   * Returns alphabetic comparison of transaction buckets.
   * @param {Transaction} a - First Transaction to compare buckets.
   * @param {Transaction} b - Second Transaction to compare buckets.
   * @param {boolean} asc - True if comparison is ascending, false otherwise.
   * @returns {number} Numerical sort value that is negative if a < b, 0 if a=b, positive if a > b (pos and neg switch if asc is false).
   */
  static bucketCompare(a, b, asc) {
    // TODO make sorting by this keep a consistent date sort within bucket
    var date_sort_val = Transaction.dateCompare(a, b, false);
    if (a["bucket"] > b["bucket"]) {
      var bucket_sort_val = -1 * Math.pow(-1, 1 + asc);
      return bucket_sort_val;
    }
    if (b["bucket"] > a["bucket"]) {
      var bucket_sort_val = 1 * Math.pow(-1, 1 + asc);
      return bucket_sort_val;
    }
    return 0;
  }
}

/**
 * Holds Transactions and sort parameters.
 * @module BucketBudget~Ledger
 * @class
 */
class Ledger {
  /**
   * Creates an empty Ledger with:
   * - id_counter = 0
   * - sort_field = "date"
   * - sort_dir_asc = false
   */
  constructor() {
    /**
     * Transactions accessed by ledger ID.
     * @member {Dictionary<string,Transaction>} transactions
     * @memberof module:BucketBudget~Ledger
     * @instance
     */
    this.transactions = {};

    /**
     * Counter used to determine the ledger and transaction IDs for new transactions.
     * @member {number} id_counter
     * @memberof module:BucketBudget~Ledger
     * @instance
     */
    this.id_counter = 0;

    /**
     * The field the ledger is being sorted by.
     * @member {string} sort_field
     * @memberof module:BucketBudget~Ledger
     * @instance
     */
    this.sort_field = "date";

    /**
     * True if ledger sorted in ascending order, false otherwise.
     * @member {boolean} sort_dir_asc
     * @memberof module:BucketBudget~Ledger
     * @instance
     */
    this.sort_dir_asc = false;
  }

  /**
   * Adds new transaction to the ledger's dictionary.
   * @param {Transaction} transaction - The transaction to add to the ledger.
   * @returns {number} The new value of the bucket associated with the transaction.
   */
  addTransaction(transaction) {
    // Add the transaction and get default new bucket value.
    var ledger_id = "_" + transaction.id;
    this.transactions[ledger_id] = transaction;
    var new_bucket_val = Number((transaction.bucket_before + transaction.value).toFixed(2));

    // If this transaction's date is before the latest transaction, update future transactions.
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

      // Update the rest of the transactions in this bucket.
      new_bucket_val = this.updateLedger(before_id);
    }

    // Update ledger id counter and sort ledger by its sort parameters.
    this.id_counter++;
    this.sortLedger();
    return new_bucket_val;
  }

  /**
   * Removes a transaction from the ledger's dictionary.
   * @param {string} ledger_id - ID (key) associated with the transaction to remove.
   * @returns {number} The new value of the bucket associated with the transaction.
   */
  removeTransaction(ledger_id) {
    // Update all transactions in the corresponding bucket.
    var adjacent_ledger_ids = this.getAdjacentTransactions(ledger_id);
    var before_id = adjacent_ledger_ids[0];
    var after_id = adjacent_ledger_ids[1];

    var new_bucket_before = 0;
    if (before_id != ledger_id) {
      new_bucket_before = this.transactions[before_id].bucket_after;
    }

    this.transactions[after_id].bucket_before = new_bucket_before;

    // Update the rest of the transactions in this bucket.
    var new_bucket_val = this.updateLedger(after_id);

    // Delete transaction from the ledger.
    delete this.transactions[ledger_id];

    return new_bucket_val;
  }

  /**
   * Edits a transaction already in the ledger's dictionary.
   * @param {string} ledger_id - ID (key) associated with the transaction to remove.
   * @param {Transaction} new_transaction - Transaction containing the new values to be set.
   * @returns {number} The new value of the bucket associated with the transaction.
   */
  editTransaction(ledger_id, new_transaction) {
    // Get old transaction and bucket values.
    var old_transaction = this.transactions[ledger_id];
    var new_bucket_vals = [[old_transaction.bucket, old_transaction.bucket_after],
    [new_transaction.bucket, new_transaction.bucket_after]];

    // If this transaction's date is before the latest transaction, update future transactions.
    this.sortLedger("date", false);
    var latest_ledger_id = Object.keys(this.transactions)[0];
    var latest_transaction = this.transactions[latest_ledger_id];

    if (Transaction.dateCompare(new_transaction, latest_transaction, true) < 0) {

      if (old_transaction.bucket != new_transaction.bucket) {
        // Update old bucket's transactions.
        new_bucket_vals[0][1] = this.removeTransaction(ledger_id);
      }

      // Put edited transaction where it belongs.
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

    // Sort ledger by its sort parameters.
    this.sortLedger();
    return new_bucket_vals;
  }

  /**
   * Sorts the transactions dictionary by a field in ascending or descending order.
   * @param {any} [field=this.sort_field] - The field to sort the ledger by.
   * @param {any} [asc=this.sort_dir_asc] - True if ledger sorted in ascending order, false otherwise.
   */
  sortLedger(field = this.sort_field, asc = this.sort_dir_asc) {
    var existing_transactions = this.transactions;
    switch (field) {
      case "id":
        this.transactions = Object.fromEntries(
          Object.entries(existing_transactions).sort(function (a, b) {
            return Transaction.numericCompare(a[1], b[1], asc, field);
          })
        );
        break;
      case "bucket":
        this.transactions = Object.fromEntries(
          Object.entries(existing_transactions).sort(function (a, b) {
            return Transaction.bucketCompare(a[1], b[1], asc);
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
          Object.entries(existing_transactions).sort(function (a, b) {
            return Transaction.numericCompare(a[1], b[1], asc, field);
          })
        );
        break;
    }
  }

  /**
   * Sets the sorting parameters of the ledger.
   * @param {string} field - The field the ledger should be sorted by.
   * @param {boolean} asc - True if ledger sorted in ascending order, false otherwise.
   * @returns {any} False if field or parameter types are invalid, true otherwise.
   */
  setLedgerSortParams(field, asc) {
    if (!valid_sort_fields.includes(field) || typeof (asc) != "boolean") {
      return false;
    }

    this.sort_field = field;
    this.sort_dir_asc = asc;
    return true;
  }

  /**
   * Given a transaction, finds the transactions before and after it within the same bucket.
   * @param {string} ledger_id - The ledger ID (key) of the transaction to get adjacent transactions from.
   * @returns {string[]} [before_id,after_id] - The ledger IDs (keys) of the transactions before and after within the associated bucket.
   * The before_id will be ledger_id if the transaction is the first in the bucket.
   * The after_id will be ledger_id if the transaction is the last in the bucket.
   */
  getAdjacentTransactions(ledger_id) {
    /* Yes I know sorting twice is inefficient but for the scale of a personal budget,
     it shouldn't affect performance too much (my current paper ledger has ~5000 entries for the past 5 years).*/
    this.sortLedger("date", false);

    var transaction = this.transactions[ledger_id];
    var target_bucket = transaction.bucket;

    // Get the transaction in this bucket before this and note its bucket after.
    var ledger_ids = Object.keys(this.transactions);
    var ledger_id_key_idx = ledger_ids.indexOf(ledger_id);

    // If a previous transaction in this bucket isn't found, this is the first.
    var before_id = ledger_id;

    // Assumes ledger is sorted by date then id in descending order.
    for (var i = ledger_id_key_idx + 1; i < ledger_ids.length; i++) {
      var curr_ledger_id = ledger_ids[i];
      var curr_transaction = this.transactions[curr_ledger_id];

      if (curr_transaction.bucket == target_bucket) {
        before_id = curr_ledger_id;
        break;
      }
    }

    // Get the transaction in this bucket after this and set its before to the other's after.
    var after_id = ledger_id;

    // Assumes ledger is sorted by date in descending order.
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

  /**
   * Updates all ledger transactions in the bucket of the inputted transaction.
   * @param {string} ledger_id - The ledger ID (key) of the transaction start updating from.
   * @returns {number} The new bucket value after updating transactions.
   */
  updateLedger(ledger_id) {
    // Starting at ledger_id, update every transaction in that bucket with new bucket_before.
    var transaction = this.transactions[ledger_id];
    var target_bucket = transaction.bucket;
    var curr_bucket_before = transaction.bucket_before;
    var curr_bucket_val = 0;

    var ledger_ids = Object.keys(this.transactions);

    // Assumes ledger is sorted by date and id in descending order.
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

  /**
   * Goes through each transaction in the ledger and updates the bucket if applicable.
   * @param {Bucket} bucket - The bucket existing transactions are in.
   * @param {any} new_bucket_id - The new ID for the bucket.
   * @param {any} new_bucket_name - The new display name for the bucket
   */
  updateBucketName(bucket, new_bucket_id, new_bucket_name) {

    // Add transaction in bucket to indicate changed name.
    var bucket_name = bucket.display_name;
    var bucket_id = bucket_name.toLowerCase().replaceAll(" ", "_");
    var bucket_val = bucket.value;

    var ledger_id = "_" + this.id_counter;
    var name_change_transaction = new Transaction(
      this.id_counter, "", new_bucket_id,
      "Bucket name change from \"" + bucket_name + "\" to \"" +
      new_bucket_name + "\"", 0, bucket_val
    );
    this.transactions[ledger_id] = name_change_transaction;
    this.id_counter++;

    // Update all transactions in the old bucket to the new bucket name.
    for (var ledger_id in this.transactions) {
      var transaction = this.transactions[ledger_id];
      if (transaction.bucket == bucket_id) {
        transaction.bucket = new_bucket_id;
      }
    }
  }
}

/**
 * Holds Buckets and percentages for income filter.
 * @module BucketBudget~IncomeFilter
 * @class
 */
class IncomeFilter {
  /**
   * IncomeFilter Constructer.
   * Creates empty IncomeFilter if parameters invalid or not given.
   * @param {string} display_name - The display name of the IncomeFilter.
   * This will be used as the description for transactions added using the filter.
   * @param {string[]} [bucket_ids=[]] - The ID of each Bucket that the income will go into.
   * bucket_ids[i] should correspond with percentages[i].
   * @param {number[]} [percentages=[]] - The percentages of income to go into each bucket rounded to 2 decimal places.
   * percentages[i] should correspond with bucket_ids[i].
   * @param {string} rounding_bucket - The ID of the bucket that will be affected by any rounding errors, positive or negative.
   */
  constructor(display_name, bucket_ids = [], percentages = [], rounding_bucket) {
    /**
     * Name of the IncomeFilter.
     * This will be used as the description for transactions added using the filter.
     * @member {string} display_name
     * @memberof module:BucketBudget~IncomeFilter
     * @instance
     */
    this.display_name = display_name;

    /**
     * Filter percentages accessed by Bucket ID.
     * @member {Dictionary<string,number>} bucket_percentages
     * @memberof module:BucketBudget~IncomeFilter
     * @instance
     */
    this.bucket_percentages = {};
    this.setBucketPercentages(bucket_ids, percentages);

    /**
     * The ID of the bucket that will be affected by any rounding errors, positive or negative.
     * @member {string} bucket_percentages
     * @memberof module:BucketBudget~IncomeFilter
     * @instance
     */
    this.rounding_bucket = "";
    this.setRoundingBucket(rounding_bucket);
  }

  /**
   * Sets percentages to the filter.
   * @param {string[]} bucket_ids - The ID of each Bucket that the income will go into.
   * bucket_ids[i] should correspond with percentages[i].
   * @param {number[]} percentages - The percentages of income to go into each bucket rounded to 2 decimal places.
   * percentages[i] should correspond with bucket_ids[i].
   * @return {boolean} False if percentages don't add to 100.00 or bucket_ids.length != percentages.length, True otherwise.
   */
  setBucketPercentages(bucket_ids, percentages) {
    // Verify array sizes are equal
    if (bucket_ids.length != percentages.length) {
      return false;
    }

    // Get the sum of the percentages and make sure it adds to 100.00
    var percentages_sum = percentages.reduce(function (sum, curr_val) {
      return Number((sum + curr_val).toFixed(2))
    }, 0);

    if (percentages_sum != 100.00) {
      return false;
    }

    // Don't allow using the same bucket twice
    var hasDuplicates = (new Set(bucket_ids)).size !== bucket_ids.length;
    if (hasDuplicates) {
      return false;
    }

    // Put the percentages in the filter
    for (var i = 0; i < bucket_ids.length; i++) {
      this.bucket_percentages[bucket_ids[i]] = percentages[i];
    }

    return true;
  }

  /**
   * Sets the rounding bucket
   * @param {string} rounding_bucket - The ID of the bucket that will be affected by any rounding errors, positive or negative.
   * @returns {boolean} False if rounding bucket is not used in filter, true otherwise.
   */
  setRoundingBucket(rounding_bucket) {
    if (!Object.keys(this.bucket_percentages).includes(rounding_bucket)) {
      return false;
    }

    this.rounding_bucket = rounding_bucket;
    return true;
  }

  /**
   * Goes through each percentage in the filter and updates the bucket if applicable.
   * @param {string} bucket_id - The ID of the bucket to rename.
   * @param {string} new_bucket_id - The new ID for the bucket.
   */
  updateBucketName(bucket_id, new_bucket_id) {
    if (this.bucket_percentages[bucket_id] != null) {
      // Update key (using defineProperty preserves order of percentages).
      Object.defineProperty(this.bucket_percentages, new_bucket_id,
        Object.getOwnPropertyDescriptor(this.bucket_percentages, bucket_id));
      delete this.bucket_percentages[bucket_id];
    }
  }
}

/**
 * Holds the buckets and ledger for the budget.
 * @module module:BucketBudget.Budget
 * @class
 */
class Budget {
  /** Creates an empty budget. */
  constructor() {
    /**
     * Buckets accessed by bucket ID.
     * @member {Dictionary<string,Bucket>} buckets
     * @memberof module:BucketBudget.Budget
     * @instance
     */
    this.buckets = {};

    /**
     * IncomeFilters accessed by filter ID.
     * @member {Dictionary<string,IncomeFilter>} income_filters
     * @memberof module:BucketBudget.Budget
     * @instance
     */
    this.income_filters = {};

    /**
     * The Budget's ledger.
     * @member {Ledger} ledger
     * @memberof module:BucketBudget.Budget
     * @instance
     */
    this.ledger = new Ledger();
  }

  /**
   * Adds a new bucket to the dictionary.
   * @param {string} name - The display name of the bucket.
   * @param {number} value - Value (amount of money) in the bucket.
   * @returns {boolean} False if name results in duplicate bucket, true otherwise.
   */
  addBucket(name, value) {
    var new_bucket = new Bucket(name, value);
    var bucket_id = name.toLowerCase().replaceAll(" ", "_");
    if (this.buckets[bucket_id] != null) {
      // Can't have duplicate buckets.
      return false;
    }
    this.buckets[bucket_id] = new_bucket;
    return true;
  }

  /**
   * Removes a bucket from the dictionary.
   * @param {string} bucket_id - The bucket ID (key) of the bucket to remove.
   * @returns {boolean} False if bucket ID doesnt exist, true otherwise.
   */
  removeBucket(bucket_id) {
    if (this.buckets[bucket_id] == null) {
      // Can't remove nonexistent buckets.
      return false;
    }
    delete this.buckets[bucket_id];
    return true;
  }

  /**
   * Edits an existing bucket in the dictionary and updates transactions in ledger to have updated bucket.
   * @param {string} bucket_id - The bucket ID (key) of the bucket to edit.
   * @param {any} new_bucket_name - New display name for the bucket.
   * @returns {boolean} False if new name causes a duplicate ID, true otherwise.
   */
  editBucket(bucket_id, new_bucket_name) {
    var new_bucket_id = new_bucket_name.toLowerCase().replaceAll(" ", "_");
    if (this.buckets[new_bucket_id] != null) {
      // Can't have duplicate buckets.
      return false;
    }

    // Update bucket name in ledger.
    this.ledger.updateBucketName(this.buckets[bucket_id], new_bucket_id, new_bucket_name);

    // Update bucket ID in income filters.
    var filter_keys = Object.keys(this.income_filters);
    for (var i = 0; i < filter_keys.length; i++) {
      this.income_filters[filter_keys[i]].updateBucketName(bucket_id, new_bucket_id);
    }

    // Update key and display name (using defineProperty preserves order of buckets).
    Object.defineProperty(this.buckets, new_bucket_id, Object.getOwnPropertyDescriptor(this.buckets, bucket_id));
    this.buckets[new_bucket_id].display_name = new_bucket_name;
    delete this.buckets[bucket_id];

    return true;
  }

  /**
   * Attempts to add a new IncomeFilter.
   * @param {string} filter_name - The name of the IncomeFilter.
   * @param {string[]} bucket_ids - The ID of each Bucket that the income will go into.
   * bucket_ids[i] should correspond with percentages[i].
   * @param {number[]} percentages - The percentages of income to go into each bucket rounded to 2 decimal places.
   * percentages[i] should correspond with bucket_ids[i].
   * @param {string} rounding_bucket - The ID of the bucket that will be affected by any rounding errors, positive or negative.
   * @return {boolean} False if percentages don't add to 100.00, bucket_ids.length != percentages.length,
   * bucket_ids/rounding bucket are not present within the budget, rounding bucket not in filter,
   * or filter_name is duplicate, True otherwise.
   */
  addIncomeFilter(filter_name, bucket_ids, percentages, rounding_bucket) {
    // Check that filter ID is not duplicate.
    var filter_id = filter_name.toLowerCase().replaceAll(" ", "_");
    if (this.income_filters[filter_id] != null) {
      return false;
    }

    // Check that bucket_ids are valid.
    for (var i = 0; i < bucket_ids.length; i++) {
      if (this.buckets[bucket_ids[i]] == null) {
        return false;
      }
    }

    // Check that the rounding_bucket is valid.
    if (this.buckets[rounding_bucket] == null) {
      return false;
    }

    var new_income_filter = new IncomeFilter(filter_name, bucket_ids, percentages, rounding_bucket);
    if (JSON.stringify(new_income_filter.bucket_percentages) == "{}" || new_income_filter.rounding_bucket == "") {
      return false;
    }

    // Add valid income filter to the dictionary
    this.income_filters[filter_id] = new_income_filter;
    return true;
  }

  /**
   * Removes an IncomeFilter from the dictionary.
   * @param {string} filter_id - The filter ID (key) of the filter to remove.
   * @returns {boolean} False if filter ID doesn't exist, true otherwise.
   */
  removeIncomeFilter(filter_id) {
    if (this.income_filters[filter_id] == null) {
      // Can't remove nonexistent filters.
      return false;
    }
    delete this.income_filters[filter_id];
    return true;
  }

  /**
   * Attempts to edit an existing IncomeFilter in the dictionary.
   * @param {string} filter_id - The filter ID (key) of the filter to remove.
   * @param {string} new_filter_name - The name of the IncomeFilter.
   * @param {string[]} bucket_ids - The ID of each Bucket that the income will go into.
   * bucket_ids[i] should correspond with percentages[i].
   * @param {number[]} percentages - The percentages of income to go into each bucket rounded to 2 decimal places.
   * percentages[i] should correspond with bucket_ids[i].
   * @param {string} rounding_bucket - The ID of the bucket that will be affected by any rounding errors, positive or negative.
   * @return {boolean} False if percentages don't add to 100.00, bucket_ids.length != percentages.length,
   * bucket_ids are not present within the budget, or filter_name is duplicate, True otherwise.
   */
  editIncomeFilter(filter_id, new_filter_name, bucket_ids, percentages, rounding_bucket) {
    // Check that filter ID is not duplicate.
    var new_filter_id = new_filter_name.toLowerCase().replaceAll(" ", "_");
    if (this.income_filters[new_filter_id] != null) {
      return false;
    }

    // Check that bucket_ids are valid.
    for (var i = 0; i < bucket_ids.length; i++) {
      if (this.buckets[bucket_ids[i]] == null) {
        return false;
      }
    }

    // Check that the rounding_bucket is valid.
    if (this.buckets[rounding_bucket] == null) {
      return false;
    }

    // Make sure updated filter values are valid
    var bp_success = this.income_filters[filter_id].setBucketPercentages(bucket_ids, percentages);
    var rb_success = this.income_filters[filter_id].setRoundingBucket(rounding_bucket);
    if (!(bp_success && rb_success)) {
      return false;
    }

    // Update key and display name (using defineProperty preserves order of filters).
    Object.defineProperty(this.income_filters, new_filter_id, Object.getOwnPropertyDescriptor(this.income_filters, filter_id));
    this.income_filters[new_filter_id].display_name = new_filter_name;
    delete this.income_filters[filter_id];

    return true;
  }

  /**
   * Adds a transaction to the ledger.
   * @param {string} date - Date the transaction occurred in YYYY-MM-DD format.
   * @param {string} bucket - The bucket ID of the bucket this transaction is in.
   * @param {string} description - Description of the transaction. Generally 128 characters or shorter.
   * @param {number} value - Value of the transaction rounded to 2 decimal places.
   * @returns {boolean} Returns true after adding transaction to ledger.
   */
  addTransaction(date, bucket, description, value) {
    var transaction = new Transaction(this.ledger.id_counter,
      date, bucket, description, Number(value.toFixed(2)),
      this.buckets[bucket].value
    );

    this.buckets[bucket].value = this.ledger.addTransaction(transaction);
    return true;
  }

  /**
   * Removes a transaction from the ledger and updates the value of the bucket it was in.
   * @param {string} transaction_id - ID (key) of the transaction being removed.
   * @returns {boolean} Returns true after removing the transaction.
   */
  removeTransaction(transaction_id) {
    var transaction = this.ledger.transactions[transaction_id];
    var target_bucket = transaction.bucket;

    this.buckets[target_bucket].value = this.ledger.removeTransaction(transaction_id);

    return true;
  }

  /**
   * Edits a ledger transaction and updates affected bucket values.
   * @param {string} date - Date the transaction occurred in YYYY-MM-DD format.
   * @param {string} bucket - The bucket this transaction is in. Budget.buckets is used to get the Bucket object associated with this.
   * @param {string} description - Description of the transaction. Generally 128 characters or shorter.
   * @param {number} value - Value of the transaction rounded to 2 decimal places.
   * @param {string} transaction_id - ID (key) of the transaction being edited.
   * @returns {boolean} Returns true after editing the transaction.
   */
  editTransaction(date, bucket, description, value, transaction_id) {
    var new_transaction = new Transaction(Number(transaction_id.replace("_", "")),
      date, bucket, description, Number(value.toFixed(2)),
      this.ledger.transactions[transaction_id].bucket_before
    );

    // Update bucket values, if new and old buckets are the same, the new value overwrites the old one.
    var bucket_vals = this.ledger.editTransaction(transaction_id, new_transaction);
    this.buckets[bucket_vals[0][0]].value = bucket_vals[0][1];
    this.buckets[bucket_vals[1][0]].value = bucket_vals[1][1];

    return true;
  }

  /**
   * Sorts the ledger by its sorting parameters.
   * @returns {boolean} Returns true after sorting the ledger.
   */
  sortLedger() {
    this.ledger.sortLedger();
    return true;
  }

  /**
   * Sets the sorting parameters of the ledger.
   * @param {string} sort_field - The field the ledger should be sorted by.
   * @param {boolean} sort_dir_asc - True if ledger sorted in ascending order, false otherwise.
   * @returns {any} False if field or parameter types are invalid, true otherwise.
   */
  setLedgerSortParams(sort_field, sort_dir_asc) {
    return this.ledger.setLedgerSortParams(sort_field, sort_dir_asc);
  }
}

//===End Budget-related Classes===

//===Start File Import/Export Functions===

/**
 * Imports a budget from a JSON object.
 * @param {Object} object - JSON object gotten from the reader. Ideally a Budget.
 * @returns {bool} False if the JSON object is not formatted as a correct Budget, true otherwise.
 * @module module:BucketBudget.importJSON()
 */
function importJSON(object) {
  var imported_budget = new Budget();

  // If there are any objects that aren't correctly defined in the import file, let user know.
  // TODO make this more informative:
  // [bucket_display_name,bucket_value,duplicate_bucket,sort_field,sort_dir_asc,ledger_transactions,
  // transaction(id,date,bucket,bucket_before,value,description)]
  var invalid_JSON = false;

  // Add all the buckets.
  if (!object.buckets) {
    invalid_JSON = true;
  } else {
    var bucket_keys = Object.keys(object.buckets);
    for (var i = 0; i < bucket_keys.length; i++) {
      var curr_filter = object.buckets[bucket_keys[i]];
      var name = "";
      var val = 0;

      // Bucket input validation.
      if (curr_filter.display_name == null || typeof (curr_filter.display_name) != "string") {
        invalid_JSON = true;
        name = "INVALID_JSON_BUCKET_" + i;
      } else {
        name = curr_filter.display_name;
      }

      if (curr_filter.value == null || typeof (curr_filter.value) != "number") {
        invalid_JSON = true;
        val = 0
      } else {
        val = curr_filter.value;
      }
      var success = imported_budget.addBucket(name, val);
      if (!success) {
        invalid_JSON = true;
        imported_budget.addBucket("INVALID_JSON_BUCKET_" + i, val);
      }
    }
  }

  // TODO Add all the IncomeFilters.
  if (!object.income_filters) {
    invalid_JSON = true;
  } else {
    var filter_keys = Object.keys(object.income_filters);
    for (var i = 0; i < filter_keys.length; i++) {
      var curr_filter = object.income_filters[filter_keys[i]];
      var name = "";
      var bucket_percentages = {};
      var rounding_bucket = "";

      // IncomeFilter display name input validation.
      if (curr_filter.display_name == null || typeof (curr_filter.display_name) != "string") {
        invalid_JSON = true;
        name = "INVALID_JSON_INCOME_FILTER_" + i;
      } else {
        name = curr_filter.display_name;
      }

      // IncomeFilter bucket percentages input validation.
      if (curr_filter.bucket_percentages == null) {
        invalid_JSON = true;
        bucket_percentages["INVALID_JSON_INCOME_FILTER_BUCKET_PERCENTAGE"] = 100.00;
      } else {
        // Verify bucket percentages are valid.
        var filter_bucket_id_keys = Object.keys(curr_filter.bucket_percentages);
        var bucket_ids = [];
        var percentages = [];
        var percentage_sum = 0;
        for (var j = 0; j < filter_bucket_id_keys.length; j++) {
          var curr_bucket_id = filter_bucket_id_keys[j];
          var curr_percentage = curr_filter.bucket_percentages[curr_bucket_id];

          // Verify bucket ID is valid
          if (typeof (curr_bucket_id) != "string" || imported_budget.buckets[curr_bucket_id] == null) {
            invalid_JSON = true;
            curr_bucket_id = "INVALID_JSON_INCOME_FILTER_BUCKET" + j;
          }

          // Verify percentage is valid
          if (typeof (curr_percentage) != "number" || curr_percentage != Number(curr_percentage.toFixed(2))) {
            invalid_JSON = true;
            curr_percentage = 0.00;
          }

          bucket_ids.push(curr_bucket_id);
          percentages.push(curr_percentage);
          percentage_sum = Number((percentage_sum + curr_percentage).toFixed(2));
        }

        // Verify percentage sum is valid
        if (percentage_sum != 100.00) {
          bucket_ids.push("INVALID_JSON_INCOME_FILTER_SUM");
          percentages.push(Number((100.00 - percentage_sum).toFixed(2)));
        }
      }

      // IncomeFilter rounding bucket input validation.
      if (curr_filter.rounding_bucket == null ||
        typeof (curr_filter.rounding_bucket) != "string" ||
        !bucket_ids.includes(curr_filter.rounding_bucket)) {
        invalid_JSON = true;
        rounding_bucket = "INVALID_JSON_INCOME_FILTER_ROUNDING_BUCKET" + i;
      } else {
        rounding_bucket = curr_filter.rounding_bucket;
      }

      imported_budget.addIncomeFilter(name, bucket_ids, percentages, rounding_bucket);
    }
  }

  // Ledger input validation.
  if (!object.ledger || !object.ledger.transactions) {
    invalid_JSON = true;
  } else {
    // Sort input validation.
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

    // Check that each transaction has the required fields (even if empty).
    var invalid_id_counter = 0;
    var max_id = 0;
    var imported_transactions = {};
    var import_ledger_keys = Object.keys(object.ledger.transactions);
    for (var i = 0; i < import_ledger_keys.length; i++) {
      var curr_transaction = object.ledger.transactions[import_ledger_keys[i]];
      var curr_id = invalid_id_counter;
      var curr_date = "0001-01-01";
      var curr_filter = "INVALID_JSON_TRANSACTION_BUCKET";
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

      // Check date.
      if (curr_transaction.date == null || typeof (curr_transaction.date) != "string"
        || curr_transaction.date.match("[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]") == null) {
        invalid_JSON = true;
      } else {
        curr_date = curr_transaction.date;
      }

      // Check bucket.
      if (curr_transaction.bucket == null || typeof (curr_transaction.bucket) != "string") {
        invalid_JSON = true;
      } else if (Object.keys(imported_budget.buckets).indexOf(curr_transaction.bucket)) {
        invalid_JSON = true;
        curr_filter = curr_transaction.bucket;
      } else {
        curr_filter = curr_transaction.bucket;
      }

      // Check bucket before.
      if (curr_transaction.bucket_before == null || typeof (curr_transaction.bucket_before) != "number") {
        invalid_JSON = true;
      } else {
        curr_bucket_before = curr_transaction.bucket_before;
      }

      // Check value.
      if (curr_transaction.value == null || typeof (curr_transaction.value) != "number") {
        invalid_JSON = true;
      } else {
        curr_val = curr_transaction.value;
      }

      // Check description.
      if (curr_transaction.description == null || typeof (curr_transaction.description) != "string") {
        invalid_JSON = true;
      } else {
        curr_desc = curr_transaction.description;
      }

      imported_transactions[import_ledger_keys[i]] = new Transaction(curr_id, curr_date, curr_filter,
        curr_desc, curr_val, curr_bucket_before)
    }
    imported_budget.ledger.transactions = imported_transactions;

    // Check id_counter.
    if (object.ledger.id_counter == null || typeof (object.ledger.id_counter) != "number" ||
      object.ledger.id_counter < max_id + invalid_id_counter) {
      invalid_JSON = true;
      imported_budget.ledger.id_counter = max_id + invalid_id_counter;
    } else {
      imported_budget.ledger.id_counter = object.ledger.id_counter;
    }

  }

  USER_BUDGET = imported_budget;
  return invalid_JSON;
}

/**
 * Exports a Budget to a JSON file and creates an object URL for it, saving it in exportDataFile.
 * @param {Budget} budget - The Budget to export.
 * @module module:BucketBudget.exportJSON()
 */
function exportJSON(budget) {
  const data = new Blob([JSON.stringify(budget)], { type: "application/json" });

  // If replacing previous file, revoke object URL to avoid memory leaks.
  if (exportDataFile !== null) {
    window.URL.revokeObjectURL(exportDataFile);
  }

  exportDataFile = window.URL.createObjectURL(data);
}

// ===End File Import/Export Functions===

// ===Start Front-end/HTML Functions===

/**
 * Runs when import button is pressed.
 * Imports the uploaded data file and sets USER_BUDGET equal to it.
 * @module module:BucketBudget.importData()
 */
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

  // Make promise to ensure data is read from file before being used in import functions.
  var file_read_promise = new Promise(function (resolve, reject) {
    var reader = new FileReader();

    switch (file_type) {
      case 'application/json':
        // Wait until read finishes before importing data.
        reader.onloadend = function () {
          var object = JSON.parse(reader.result);
          importJSON(object);
          resolve();
        }
        break;
      // TODO allow csv import
    }

    // Handle errors.
    reader.onerror = function (error) {
      reject(error);
    }

    reader.readAsText(file);
  });
  file_read_promise.then(
    function () {
      // Propagate changes to bucket table.
      updateBucketTable();

      // Propagate changes to income filters.
      updateIncomeFilters();

      // Propagate changes to visual ledger.
      updateLedgerTable();
    },
    function (error) {
      alert(error);
    }
  );
}

/**
 * Runs when export button is pressed.
 * Exports USER_BUDGET and downloads it to the user's machine.
 * @param {string} filetype - The file extension for the exported file, decided by the export button.
 * @module module:BucketBudget.exportData()
 */
function exportData(filetype) {
  // Set object URL for the current budget
  switch (filetype) {
    case 'json':
      exportJSON(USER_BUDGET);
      break;
    // TODO allow csv export
  }

  // Click the object URL link to download.
  var link = document.createElement('a');
  link.setAttribute('download', 'budget.' + filetype);
  link.href = exportDataFile;
  link.click();
}

/**
 * Updates the HTML bucket table with the data in USER_BUDGET.
 * @module module:BucketBudget.updateBucketTable()
 */
function updateBucketTable() {
  // Empty table.
  var table = document.getElementById("bucket-table");
  table.innerHTML = "";

  // Empty bucket selects.
  var bucket_selects = document.getElementsByClassName("bucket-input");
  for (var i = 0; i < bucket_selects.length; i++) {
    bucket_selects[i].innerHTML = "<option value='' disabled selected>Select a bucket</option>";
  }

  // Add header.
  var header_labels = ["Bucket", "Value", "", ""];
  var header = document.createElement('tr');

  for (var i = 0; i < header_labels.length; i++) {
    var cell = document.createElement('th');
    cell.innerHTML = header_labels[i];
    header.appendChild(cell);
  }
  table.appendChild(header);



  // Add buckets.
  for (var bucket_id in USER_BUDGET.buckets) {
    var entry = document.createElement('tr');
    var bucket = USER_BUDGET.buckets[bucket_id];

    // Entry values.
    var name_entry = document.createElement('td');
    name_entry.setAttribute("id", bucket_id);
    name_entry.innerHTML = bucket.display_name;

    var value_entry = document.createElement('td');
    value_entry.innerHTML = formatter.format(bucket.value);

    // Edit and remove buttons.
    var edit_button = document.createElement('td');
    edit_button.innerHTML = "<button class='bucket-edit' onclick='editBucket(\"" + bucket_id + "\",this)'>Edit</button>"

    var remove_button = document.createElement('td');
    remove_button.innerHTML = "<button class='bucket-remove' onclick='removeBucket(\"" + bucket_id + "\")'>Remove</button>"

    // Add to table.
    entry.appendChild(name_entry);
    entry.appendChild(value_entry);
    entry.appendChild(edit_button);
    entry.appendChild(remove_button);
    table.appendChild(entry);

    // Update every bucket selector.
    var select_option = document.createElement('option');
    select_option.setAttribute("value", bucket_id);
    select_option.innerHTML = bucket.display_name;

    for (var i = 0; i < bucket_selects.length; i++) {
      bucket_selects[i].appendChild(select_option.cloneNode(true));
    }
  }

  // Empty new bucket fields.
  document.getElementById("new-bucket-name").value = "";

}

/**
 * Runs when add bucket button is pressed.
 * Adds a bucket to USER_BUDGET using the name from the text input.
 * @module module:BucketBudget.addBucket()
 */
function addBucket() {
  var new_bucket_name = document.getElementById("new-bucket-name").value;
  if (new_bucket_name == "") {
    alert("Please enter a name for the new bucket.");
    return;
  }
  var success = USER_BUDGET.addBucket(new_bucket_name, 0);

  // If bucket already exists, alert user.
  if (!success) {
    alert("New bucket name too similar to existing bucket name.");
    return;
  }

  // Propagate changes to bucket table.
  updateBucketTable();
}

/**
 * Runs when a remove button in the HTML bucket table is pressed.
 * Removes bucket from USER_BUDGET.
 * @param {string} bucket_id - ID (key) of the bucket to be removed from USER_BUDGET.
 * @module module:BucketBudget.removeBucket()
 */
function removeBucket(bucket_id) {
  USER_BUDGET.removeBucket(bucket_id);

  // Propagate changes to bucket table.
  updateBucketTable();
}

/**
 * Runs when an edit button in the HTML bucket table is pressed.
 * Sets elements in bucket table to edit the bucket name.
 * @param {string} bucket_id - ID (key) of the bucket to be edited.
 * @param {Object} edit_button - The edit button that was pressed.
 * @module module:BucketBudget.editBucket()
 */
function editBucket(bucket_id, edit_button) {
  // Get cell that bucket name is in and change to input field.
  var cell = document.getElementById(bucket_id);
  var curr_cell_inner = cell.innerHTML;
  cell.innerHTML = "<input id='" + bucket_id + "_edit' type='text' Value='" + curr_cell_inner + "'>";

  // Add cancel button under input field.
  cell.innerHTML += "<button id='" + bucket_id + "_cancel' onclick='cancelBucketEdit(\"" + bucket_id + "\",this)'>Cancel</button>";

  // Change this button to Submit Changes.
  edit_button.setAttribute("id", bucket_id + "_submit");
  edit_button.setAttribute("onclick", "confirmBucketEdit(\"" + bucket_id + "\")");
  edit_button.innerHTML = "Submit Changes";
}

/**
 * Runs when a cancel button in the HTML bucket table is pressed.
 * Returns the row of the table to displaying the original bucket name.
 * @param {string} bucket_id - ID (key) of the bucket being edited.
 * @param {Object} cancel_button - The cancel button that was pressed.
 * @module module:BucketBudget.cancelBucketEdit()
 */
function cancelBucketEdit(bucket_id, cancel_button) {
  // Replace input with plane-text of the bucket's display name.
  var cell = document.getElementById(bucket_id);
  cell.innerHTML = USER_BUDGET.buckets[bucket_id].display_name;

  // Switch Submit Changes button back to Edit.
  var submit_button = document.getElementById(bucket_id + "_submit");
  submit_button.removeAttribute("id");
  submit_button.setAttribute("onclick", "editBucket(\"" + bucket_id + "\",this)")
  submit_button.innerHTML = "Edit";

  // Remove cancel button.
  cancel_button.remove();
}

/**
 * Runs when submit changes button in the HTML bucket table is pressed.
 * Takes the new name of the bucket and changes it in USER_BUDGET if it isn't a duplicate.
 * @param {string} bucket_id - ID (key) of the bucket to be edited in USER_BUDGET.
 * @module module:BucketBudget.confirmBucketEdit()
 */
function confirmBucketEdit(bucket_id) {
  // Check if new bucket name is valid, if not, give alert.
  var new_bucket_name = document.getElementById(bucket_id + "_edit").value;
  var success = USER_BUDGET.editBucket(bucket_id, new_bucket_name);
  if (!success) {
    alert("New bucket name too similar to existing bucket name.");
    return;
  }

  // Propagate changes to bucket table.
  updateBucketTable();

  // Propagate changes to visual ledger.
  updateLedgerTable();
}

/**
 * Updates the income filter select option.
 * @module module:BucketBudget.updateIncomeFilters()
 */
function updateIncomeFilters() {
  // Empty income filter inputs.
  var filter_select = document.getElementById("filter-preview-input");
  filter_select.innerHTML = "<option value='' disabled selected>Select a filter</option>";

  document.getElementById("income-preview-input").value = "";

  document.getElementById("date-filter-use-input").value = "";

  // Update the income filter selector.
  var filter_keys = Object.keys(USER_BUDGET.income_filters);
  for (var i = 0; i < filter_keys.length; i++) {
    var filter_id = filter_keys[i];
    var filter_name = USER_BUDGET.income_filters[filter_id].display_name;

    var select_option = document.createElement('option');
    select_option.setAttribute("value", filter_id);
    select_option.innerHTML = filter_name;

    filter_select.appendChild(select_option);
  }

  // Empty filter name input.
  var filter_name_box = document.getElementById("new-filter-name");
  filter_name_box.value = "";

  // Reset add, edit, and reset buttons
  var edit_button = document.getElementById("filter-edit-submit");
  edit_button.style = "visibility: visible;";

  var add_button = document.getElementById("filter-submit-edit");
  if (add_button != null) {
    add_button.setAttribute("id", "new-filter-submit");
    add_button.setAttribute("onclick", "addIncomeFilter()");
    add_button.innerHTML = "Add Filter";
  }

  var reset_button = document.getElementById("reset-filter-table");
  reset_button.innerHTML = "Reset Table";

  // Clear new income filter fields.
  var table = document.getElementById("income-filter-table");
  table.innerHTML = "";

  var new_table = document.createElement("tbody");

  // Header row.
  var header_row = document.createElement("tr");

  var bucket = document.createElement("th");
  var percentage = document.createElement("th");
  var rounding_radio = document.createElement("th");
  var button = document.createElement("th");

  bucket.innerHTML = "Bucket";
  percentage.innerHTML = "Percentage";
  rounding_radio.innerHTML = "Rounding Bucket?";

  header_row.appendChild(bucket);
  header_row.appendChild(percentage);
  header_row.appendChild(rounding_radio);
  header_row.appendChild(button);

  // Input row.
  var input_row = document.createElement("tr");

  bucket = document.createElement("td");
  percentage = document.createElement("td");
  rounding_radio = document.createElement("td");
  button = document.createElement("td");

  bucket.appendChild(document.createElement("select"));
  bucket.children[0].className = "bucket-input bucket-filter-input";
  bucket.children[0].innerHTML = document.getElementById("bucket-transaction-input")
    .cloneNode(true).innerHTML;

  percentage.appendChild(document.createElement("input"));
  percentage.children[0].className = "percent-filter-input";
  percentage.children[0].type = "number";
  percentage.children[0].step = "0.05";
  percentage.children[0].placeholder = "% of income";

  rounding_radio.appendChild(document.createElement("input"));
  rounding_radio.children[0].className = "rounding-filter-input";
  rounding_radio.children[0].type = "radio";
  rounding_radio.children[0].name = "filter-rounding-select";
  rounding_radio.children[0].checked = true;

  button.appendChild(document.createElement("button"));
  button.children[0].innerHTML = "Add Bucket to Filter";
  button.children[0].id = "new-bucket-filter";
  button.children[0].setAttribute("onclick", "addBucketToFilter(this)");

  input_row.appendChild(bucket);
  input_row.appendChild(percentage);
  input_row.appendChild(rounding_radio);
  input_row.appendChild(button);

  // Construct table
  var new_table = document.createElement("tbody");
  new_table.appendChild(header_row);
  new_table.appendChild(input_row);

  table.appendChild(new_table);
}

/**
 * Runs when add filter button is pressed.
 * Takes the name of the filter, buckets, and percentages and adds an income filter.
 * @module module:BucketBudget.addIncomeFilter()
 */
function addIncomeFilter() {
  // Get filter name.
  var new_filter_name = document.getElementById("new-filter-name").value;
  if (new_filter_name == "") {
    alert("Please enter a name for the new filter.");
    return;
  }

  // Get all the buckets, percentages, and rounding bucket
  var filter_buckets = document.getElementsByClassName("bucket-filter-input");
  var filter_percentages = document.getElementsByClassName("percent-filter-input");
  var filter_rounding_radios = document.getElementsByClassName("rounding-filter-input");

  var bucket_ids = [];
  var percentages = [];
  var rounding_bucket = "";
  for (var i = 0; i < filter_buckets.length; i++) {
    bucket_ids.push(filter_buckets[i].value);
    percentages.push(Number(Number(filter_percentages[i].value).toFixed(2)));
    if (filter_rounding_radios[i].checked) {
      rounding_bucket = filter_buckets[i].value;
    }
  }

  var success = USER_BUDGET.addIncomeFilter(new_filter_name, bucket_ids,
    percentages, rounding_bucket);

  // If filter name already exists or percentages dont add to 100.00, alert user.
  if (!success) {
    alert("Please make sure the income filter percentages add to 100.00, all buckets are selected and not repeated, and filter name is not a duplicate.");
    return;
  }

  // Update filter selector and reset income filter table
  updateIncomeFilters();
}

/**
 * Runs when a remove filter button in the HTML income filter table is pressed.
 * Removes the selected income filter from USER_BUDGET.
 * @module module:BucketBudget.removeIncomeFilter()
 */
function removeIncomeFilter() {
  // Validate input.
  var filter_id = document.getElementById("filter-preview-input").value;
  if (filter_id == "") {
    alert("Please select an income filter to remove.");
    return;
  }

  USER_BUDGET.removeIncomeFilter(filter_id);
  updateIncomeFilters();
}

/**
 * Runs when a edit filter button in the HTML income filter table is pressed.
 * Enables editing the selected income filter using the income filter table.
 * @param {Object} edit_button - The edit button that was pressed.
 * @module module:BucketBudget.editIncomeFilter()
 */
function editIncomeFilter(edit_button) {
  // Validate input.
  var filter_id = document.getElementById("filter-preview-input").value;
  if (filter_id == "") {
    alert("Please select an income filter to edit.");
    return;
  }
  var filter = USER_BUDGET.income_filters[filter_id];

  // Clear the income filter table.
  updateIncomeFilters();

  // Change add filter button to a submit changes button.
  var submit_button = document.getElementById("new-filter-submit");
  submit_button.innerHTML = "Submit Changes";
  submit_button.setAttribute("id", "filter-submit-edit");
  submit_button.setAttribute("onclick", "confirmIncomeFilterEdit(this)");

  // Change Reset Table button text to Cancel Edit
  var cancel_button = document.getElementById("reset-filter-table");
  cancel_button.innerHTML = "Cancel Edit";

  // Set Filter Name.
  var filter_name_box = document.getElementById("new-filter-name");
  filter_name_box.value = filter.display_name;

  // Set first input row
  var bucket_ids = Object.keys(filter.bucket_percentages);

  var table = document.getElementById("income-filter-table");

  var input_row = table.children[0].children[1];

  var bucket = input_row.children[0];
  var percentage = input_row.children[1];
  var rounding_radio = input_row.children[2];
  var button = input_row.children[3];

  bucket.children[0].value = bucket_ids[0];
  percentage.children[0].value = filter.bucket_percentages[bucket_ids[0]];
  if (bucket_ids[0] != filter.rounding_bucket) {
    rounding_radio.checked = false;
  }
  button.children[0].innerHTML = "Remove Bucket from Filter";
  button.children[0].setAttribute("onclick", "removeBucketFromFilter(this)");


  // Fill income filter table with editable fields using existing filter values.
  for (var i = 1; i < bucket_ids.length; i++) {
    input_row = document.createElement("tr");

    bucket = document.createElement("td");
    percentage = document.createElement("td");
    rounding_radio = document.createElement("td");
    button = document.createElement("td");

    bucket.appendChild(document.getElementsByClassName("bucket-input")[0].cloneNode(true));
    percentage.appendChild(document.getElementsByClassName("percent-filter-input")[0].cloneNode(true));
    rounding_radio.appendChild(document.getElementsByClassName("rounding-filter-input")[0].cloneNode(true));
    button.appendChild(document.getElementById("new-bucket-filter").cloneNode(true));

    bucket.children[0].value = bucket_ids[i];
    percentage.children[0].value = filter.bucket_percentages[bucket_ids[i]];
    if (bucket_ids[i] != filter.rounding_bucket) {
      rounding_radio.children[0].checked = false;
    }
    button.children[0].innerHTML = "Remove Bucket from Filter";
    button.children[0].setAttribute("onclick", "removeBucketFromFilter(this)");
    button.children[0].className = "remove-bucket-filter";

    input_row.appendChild(bucket);
    input_row.appendChild(percentage);
    input_row.appendChild(rounding_radio);
    input_row.appendChild(button);

    table.children[0].appendChild(input_row);
  }

  // Change final button to add a bucket to filter.
  button.children[0].innerHTML = "Add New Bucket from Filter";
  button.children[0].setAttribute("onclick", "addBucketToFilter(this)");

  // Make edit button invisible.
  edit_button.style = "visibility: hidden;";
}

/**
 * Runs when a submit changes button in the HTML income filter table is pressed.
 * Attempts to make the changes to the income filter if they are valid.
 * @param {Object} confirm_button - The confirm button pressed.
 * @module module:BucketBudget.confirmIncomeFilterEdit()
 */
function confirmIncomeFilterEdit(confirm_button) {
  var success = USER_BUDGET.editIncomeFilter(filter_id, new_filter_name, bucket_ids, percentages, rounding_bucket);

  // If filter name already exists or percentages dont add to 100.00, alert user.
  if (!success) {
    alert("Please make sure the income filter percentages add to 100.00, all buckets are selected and not repeated, and filter name is not a duplicate.");
    return;
  }

  // Update filter selector and reset income filter table
  updateIncomeFilters();
}

/**
 * Does input validation and amount calculations for input filters before preview or use.
 * @param {boolean} preview_or_use - True if previewing filter, false if using filter.
 * @module module:BucketBudget.incomeFilterCheck()
 */
function incomeFilterCheck(preview_or_use) {
  // Validate input.
  var filter_id = document.getElementById("filter-preview-input").value;
  if (filter_id == "") {
    alert("Please select an income filter.");
    return;
  }

  var income = document.getElementById("income-preview-input").value;
  income = Number(Number(income).toFixed(2));
  if (income == "" || income < 0.01) {
    alert("Please input a number of at least 0.01 into the income field.");
    return;
  }

  var transaction_date = "";
  if (!preview_or_use) {
    transaction_date = document.getElementById("date-filter-use-input").value;
    if (transaction_date == "") {
      alert("Please select a date for the filter transactions.");
      return;
    }
  }

  // User income filter table to preview the filter with the specified income.
  var filter = USER_BUDGET.income_filters[filter_id];

  // Calculate money for each bucket beforehand in case of rounding
  var filter_keys = Object.keys(filter.bucket_percentages);
  var amounts = Array(filter_keys.length).fill(0);
  var rounding_bucket_idx;
  for (var i = 0; i < filter_keys.length; i++) {
    var filter_key = filter_keys[i];
    if (filter_key == filter.rounding_bucket) {
      rounding_bucket_idx = i;
    }
    amounts[i] = Number(((filter.bucket_percentages[filter_key] / 100) * income).toFixed(2));
  }

  // Get the sum of the amounts to get the difference from income to apply to rounding bucket.
  var amounts_sum = amounts.reduce(function (sum, curr_val) {
    return Number((sum + curr_val).toFixed(2))
  }, 0);
  amounts[rounding_bucket_idx] += income - amounts_sum;

  if (preview_or_use) {
    previewIncomeFilter(filter_keys, amounts);
  } else {
    useIncomeFilter(filter_keys, amounts, transaction_date, filter_id);
  }
}

/**
 * Uses selected filter and income to preview amount of money going into each bucket.
 * @param {string[]} bucket_ids - Array of bucket IDs to use with the filter.
 * @param {Number[]} amounts - Monetary amounts for each bucket.
 * @module module:BucketBudget.previewIncomeFilter()
 */
function previewIncomeFilter(bucket_ids, amounts) {
  // Update table
  var table = document.getElementById("income-filter-table");
  table.innerHTML = "";

  var new_table = document.createElement("tbody");

  var row = document.createElement("tr");

  var bucket = document.createElement("th");
  var value = document.createElement("th");

  bucket.innerHTML = "Bucket";
  value.innerHTML = "Value";

  row.appendChild(bucket);
  row.appendChild(value);
  table.appendChild(row);

  for (var i = 0; i < bucket_ids.length; i++) {
    row = document.createElement("tr");

    bucket = document.createElement("td");
    value = document.createElement("td");

    bucket.innerHTML = USER_BUDGET.buckets[bucket_ids[i]].display_name;
    value.innerHTML = formatter.format(amounts[i]);

    row.appendChild(bucket);
    row.appendChild(value);
    table.appendChild(row);
  }

  table.appendChild(new_table);
}

/**
 * Uses selected filter and income to add money into the filter's buckets.
 * @param {string[]} bucket_ids - Array of bucket IDs to use with the filter.
 * @param {Number[]} amounts - Monetary amounts for each bucket.
 * @param {string} transaction_date - Date the filter transactions occurred in YYYY-MM-DD format.
 * @param {string} filter_id - ID (key) of the filter being used from USER_BUDGET.
 * @module module:BucketBudget.useIncomeFilter()
 */
function useIncomeFilter(bucket_ids, amounts, transaction_date, filter_id) {
  var description = USER_BUDGET.income_filters[filter_id].display_name;

  for (var i = 0; i < bucket_ids.length; i++) {
    USER_BUDGET.addTransaction(transaction_date, bucket_ids[i],
      description, amounts[i]);
  }

  // Empty preview/use inputs.
  document.getElementById("filter-preview-input").value = "";
  document.getElementById("income-preview-input").value = "";
  document.getElementById("date-filter-use-input").value = "";

  updateLedgerTable();
  updateBucketTable();
}

/**
 * Adds new bucket input row to income filter.
 * @param {Object} new_bucket_button - The button that was pressed
 * @module module:BucketBudget.addBucketToFilter()
 */
function addBucketToFilter(new_bucket_button) {
  // Add new input row for filter.
  var table = new_bucket_button.parentElement.parentElement.parentElement;

  var row = document.createElement("tr");

  var bucket = document.createElement("td");
  var percentage = document.createElement("td");
  var rounding_radio = document.createElement("td");
  var button = document.createElement("td");

  bucket.appendChild(document.getElementsByClassName("bucket-input")[0].cloneNode(true));
  percentage.appendChild(document.getElementsByClassName("percent-filter-input")[0].cloneNode(true));
  rounding_radio.appendChild(document.getElementsByClassName("rounding-filter-input")[0].cloneNode(true));
  button.appendChild(new_bucket_button.cloneNode(true));

  bucket.children[0].value = "";
  percentage.children[0].value = "";
  rounding_radio.children[0].checked = false;

  row.appendChild(bucket);
  row.appendChild(percentage);
  row.appendChild(rounding_radio);
  row.appendChild(button);

  table.appendChild(row);

  // Update the button to be remove.
  new_bucket_button.innerHTML = "Remove Bucket from Filter";
  new_bucket_button.className = "remove-bucket-filter";
  new_bucket_button.id = "";
  new_bucket_button.setAttribute("onclick", "removeBucketFromFilter(this)");
}

function removeBucketFromFilter(remove_button) {
  // Remove the row from the table
  var remove_row = remove_button.parentElement.parentElement;
  remove_row.remove();

  delete remove_row;
}

/**
 * Updates the HTML ledger table with the data in USER_BUDGET.
 * If a bucket no longer exists, a transaction will display the bucket ID.
 * @module module:BucketBudget.updateLedgerTable()
 */
function updateLedgerTable() {
  // Empty table.
  var table = document.getElementById("ledger-table");
  table.innerHTML = "";

  // Add header row.
  var header_labels = ["Date", "Bucket", "Description",
    "Value", "Bucket Value Before", "Bucket Value After"];
  var sortable_labels = ["Date", "Bucket", "Value"];
  var header = document.createElement('tr');

  for (var i = 0; i < header_labels.length; i++) {
    var cell = document.createElement('th');

    // Allow users to sort by different fields.
    if (sortable_labels.includes(header_labels[i])) {
      var sort_button = document.createElement("button");
      var sort_function = "sortLedgerTable('" + header_labels[i].toLowerCase() + "',true,this)";
      var button_text = header_labels[i];

      if (header_labels[i].toLowerCase() == USER_BUDGET.ledger.sort_field) {
        sort_function = "sortLedgerTable('" + header_labels[i].toLowerCase() + "'," + !USER_BUDGET.ledger.sort_dir_asc + ",this)";
        button_text += USER_BUDGET.ledger.sort_dir_asc ? " v" : " ^";
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

  // Get transactions in reverse order added.
  USER_BUDGET.sortLedger();

  // Add transactions.
  for (var ledger_id in USER_BUDGET.ledger.transactions) {
    var transaction = USER_BUDGET.ledger.transactions[ledger_id];

    var entry = document.createElement('tr');

    // Entry values.
    var date_entry = document.createElement('td');
    date_entry.setAttribute("id", ledger_id + "-date");
    date_entry.innerHTML = transaction.date;

    var bucket_entry = document.createElement('td');
    bucket_entry.setAttribute("id", ledger_id + "-bucket");

    // If bucket name has changed, display id.
    if (USER_BUDGET.buckets[transaction.bucket] == null) {
      bucket_entry.innerHTML = transaction.bucket;
    } else {
      bucket_entry.innerHTML = USER_BUDGET.buckets[transaction.bucket].display_name;
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

    // Add values to entry.
    entry.appendChild(date_entry);
    entry.appendChild(bucket_entry);
    entry.appendChild(desc_entry);
    entry.appendChild(value_entry);
    entry.appendChild(buck_bef_entry);
    entry.appendChild(buck_aft_entry);

    // Edit and remove buttons won't show on bucket name change transactions.
    if (!(transaction.date == "" && transaction.value == 0)) {
      var edit_button = document.createElement('td');
      edit_button.innerHTML = "<button class='transaction-edit' onclick='editTransaction(\"" + ledger_id + "\",this)'>Edit</button>"

      var remove_button = document.createElement('td');
      remove_button.innerHTML = "<button class='transaction-remove' onclick='removeTransaction(\"" + ledger_id + "\")'>Remove</button>"
      entry.appendChild(edit_button);
      entry.appendChild(remove_button);
    }

    // Add entry to table.
    table.appendChild(entry);
  }

  // Empty new transaction fields.
  var input_fields = ["date", "bucket-transaction", "desc", "value"];
  for (var i = 0; i < input_fields.length; i++) {
    document.getElementById(input_fields[i] + "-input").value = "";
  }

}

/**
 * Run when a column header button on the HTML ledger table is pressed.
 * Sorts the ledger by the chosen field.
 * Ascending/descending alternates if the same button is pressed multiple times.
 * @param {string} field - The field to sort by, decided by the sort button.
 * @param {boolean} asc - True if comparison is ascending, false otherwise, decided by the sort button.
 * @param {Object} sort_button - The sort button pressed.
 * @module module:BucketBudget.sortLedgerTable()
 */
function sortLedgerTable(field, asc, sort_button) {
  if (asc) {
    sort_button.setAttribute("onclick", sort_button.getAttribute("onclick").replace("true", "false"));
  } else {
    sort_button.setAttribute("onclick", sort_button.getAttribute("onclick").replace("false", "true"));
  }

  USER_BUDGET.setLedgerSortParams(field, asc);
  USER_BUDGET.sortLedger();

  // Propagate changes to visual ledger.
  updateLedgerTable();
}

/**
 * Run when add transaction button is pressed.
 * Takes values from the add new transaction section to add a new transaction to USER_BUDGET.
 * @module module:BucketBudget.addTransaction()
 */
function addTransaction() {
  // Get each field for transaction.
  var transaction_date = document.getElementById("date-input").value;
  var transaction_bucket = document.getElementById("bucket-transaction-input").value;
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


  // Add the transaction to the ledger.
  var success = USER_BUDGET.addTransaction(transaction_date, transaction_bucket,
    transaction_desc, transaction_value);

  // Propagate changes to visual ledger.
  updateLedgerTable();

  // Propagate changes to bucket table.
  updateBucketTable();
}

/**
 * Run when a remove button on the HTML ledger table is pressed.
 * Removes the corresponding transaction from USER_BUDGET.
 * @param {string} transaction_id - ID (key) of the transaction being removed from USER_BUDGET.
 * @module module:BucketBudget.removeTransaction()
 */
function removeTransaction(transaction_id) {
  // Remove transaction.
  USER_BUDGET.removeTransaction(transaction_id);

  // Propagate changes to visual ledger.
  updateLedgerTable();

  // Propagate changes to bucket table.
  updateBucketTable();
}

/**
 * Runs when an edit button in the HTML ledger table is pressed.
 * Sets elements in ledger table to edit the transaction.
 * @param {string} transaction_id - ID (key) of the transaction to be edited.
 * @param {Object} edit_button - The edit button that was pressed.
 * @module module:BucketBudget.editTransaction()
 */
function editTransaction(transaction_id, edit_button) {
  // Get cells for the transaction and change them to input fields, noting original values for each field.
  var date_cell = document.getElementById(transaction_id + "-date");
  var date_cell_inner = date_cell.innerHTML;
  date_cell.innerHTML = "<input id='" + transaction_id + "-date_edit' type='date' old_value='" + date_cell_inner + "' Value='" + date_cell_inner + "'>";

  var bucket_cell = document.getElementById(transaction_id + "-bucket");
  var bucket_cell_value = bucket_cell.innerHTML;
  var bucket_select_options = document.getElementById("bucket-transaction-input").innerHTML.replace(">" + bucket_cell_value, "selected='true'>" + bucket_cell_value);
  var bucket_cell_inner = "<select id='" + transaction_id + "-bucket_edit' old_value='" + bucket_cell_value + "' Value='" + bucket_cell_value + "'>";
  bucket_cell.innerHTML = bucket_cell_inner + bucket_select_options + "</select>";

  var desc_cell = document.getElementById(transaction_id + "-description");
  var desc_cell_inner = desc_cell.innerHTML;
  desc_cell.innerHTML = "<input id='" + transaction_id + "-description_edit' type='text' old_value='" + desc_cell_inner + "' Value='" + desc_cell_inner + "'>";

  var value_cell = document.getElementById(transaction_id + "-value");
  var value_cell_inner = value_cell.innerHTML.replace("$", "");
  value_cell.innerHTML = "<input id='" + transaction_id + "-value_edit' type='number' step='0.01' old_value='" + Number(value_cell_inner) + "' Value='" + Number(value_cell_inner) + "'>";

  // Add cancel button under input field.
  var cancel_button = document.createElement("button")
  cancel_button.setAttribute("id", transaction_id + "_cancel");
  cancel_button.setAttribute("onclick", "cancelTransactionEdit(\"" + transaction_id + "\",this)");
  cancel_button.innerHTML = "Cancel";
  edit_button.parentElement.appendChild(cancel_button);

  // Change this button to Submit Changes.
  edit_button.setAttribute("id", transaction_id + "_submit");
  edit_button.setAttribute("onclick", "confirmTransactionEdit(\"" + transaction_id + "\")");
  edit_button.innerHTML = "Submit Changes";
}

/**
 * Runs when an cancel button in the HTML ledger table is pressed.
 * Returns the row of the table to displaying the original transaction fields.
 * @param {string} transaction_id - ID (key) of the transaction being edited.
 * @param {Object} cancel_button - The cancel button that was pressed.
 * @module module:BucketBudget.cancelTransactionEdit()
 */
function cancelTransactionEdit(transaction_id, cancel_button) {
  // Replace inputs with the display values.
  var date_cell = document.getElementById(transaction_id + "-date");
  var bucket_cell = document.getElementById(transaction_id + "-bucket");
  var desc_cell = document.getElementById(transaction_id + "-description");
  var value_cell = document.getElementById(transaction_id + "-value");

  // Get the original values of the transaction.
  date_cell.innerHTML = date_cell.children[0].getAttribute("old_value");
  bucket_cell.innerHTML = bucket_cell.children[0].getAttribute("old_value");
  desc_cell.innerHTML = desc_cell.children[0].getAttribute("old_value");
  value_cell.innerHTML = formatter.format(value_cell.children[0].getAttribute("old_value"));


  // Switch Submit Changes button back to Edit.
  var submit_button = document.getElementById(transaction_id + "_submit");
  submit_button.removeAttribute("id");
  submit_button.setAttribute("onclick", "editTransaction(\"" + transaction_id + "\",this)")
  submit_button.innerHTML = "Edit";

  // Remove cancel button.
  cancel_button.remove();
}

/**
 * Runs when submit changes button in the HTML ledger table is pressed.
 * Takes the new values for the transaction and changes it in USER_BUDGET if the field values are valid.
 * @param {string} transaction_id - ID (key) of the transaction to be edited in USER_BUDGET.
 * @module module:BucketBudget.confirmBucketEdit()
 */
function confirmTransactionEdit(transaction_id) {
  // Get each field for transaction.
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

  USER_BUDGET.editTransaction(new_transaction_date, new_transaction_bucket, new_transaction_desc, new_transaction_value, transaction_id);

  // Propagate changes to bucket table.
  updateBucketTable();

  // Propagate changes to visual ledger.
  updateLedgerTable();
}

// ===End Front-end/HTML Functions===

//===Start Constants and Variables===
/**
 * List of fields that can be sorted by.
 * @constant {string[]}
 */
const valid_sort_fields = ["id", "date", "bucket", "value"];

/**
 * The file types currently supported by the import functions.
 * @constant {string[]}
 */
const valid_file_import_types = ["application/json"];

//TODO add customizable formatters for different currencies
/**
 * Formats numbers to currency for proper display.
 * @constant {Intl.NumberFormat}
 */
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

/**
 * @var {string} exportDataFile - The object URL of the exported budget data file.
 * @inner
 */
var exportDataFile = null;

/**
 * The budget being modified by the HTML interface.
 * @var {Budget} USER_BUDGET
 * @inner
 */
var USER_BUDGET = new Budget();

//===End Constands and Variables===