## Modules

<dl>
<dt><a href="#module_BucketBudget">BucketBudget</a></dt>
<dd></dd>
<dt><a href="#BucketBudget.module_importValidationJSONBuckets_new">importValidationJSONBuckets()</a></dt>
<dd><p>Validates imported JSON buckets and adds them to the imported_budget.</p>
</dd>
<dt><a href="#BucketBudget.module_importValidationJSONIncomeFiltersBucketPercentages_new">importValidationJSONIncomeFiltersBucketPercentages()</a> ⇒ <code>Object</code></dt>
<dd><p>Validates imported JSON income filter bucket percentages.</p>
</dd>
<dt><a href="#BucketBudget.module_importValidationJSONIncomeFilters_new">importValidationJSONIncomeFilters()</a></dt>
<dd><p>Validates imported JSON income filters and adds them to the imported_budget.</p>
</dd>
<dt><a href="#BucketBudget.module_importValidationJSONLedger_new">importValidationJSONLedger()</a></dt>
<dd><p>Validates imported JSON ledger and adds it to the imported_budget.</p>
</dd>
<dt><a href="#BucketBudget.module_importJSON_new">importJSON()</a> ⇒ <code>bool</code></dt>
<dd><p>Imports a budget from a JSON object.</p>
</dd>
<dt><a href="#BucketBudget.module_exportJSON_new">exportJSON()</a></dt>
<dd><p>Exports a Budget to a JSON file and creates an object URL for it, saving it in exportDataFile.</p>
</dd>
<dt><a href="#BucketBudget.module_importData_new">importData()</a></dt>
<dd><p>Runs when import button is pressed.
Imports the uploaded data file and sets USER_BUDGET equal to it.</p>
</dd>
<dt><a href="#BucketBudget.module_exportData_new">exportData()</a></dt>
<dd><p>Runs when export button is pressed.
Exports USER_BUDGET and downloads it to the user&#39;s machine.</p>
</dd>
<dt><a href="#BucketBudget.module_updateBucketTable_new">updateBucketTable()</a></dt>
<dd><p>Updates the HTML bucket table with the data in USER_BUDGET.</p>
</dd>
<dt><a href="#BucketBudget.module_addBucket_new">addBucket()</a></dt>
<dd><p>Runs when add bucket button is pressed.
Adds a bucket to USER_BUDGET using the name from the text input.</p>
</dd>
<dt><a href="#BucketBudget.module_removeBucket_new">removeBucket()</a></dt>
<dd><p>Runs when a remove button in the HTML bucket table is pressed.
Removes bucket from USER_BUDGET.</p>
</dd>
<dt><a href="#BucketBudget.module_editBucket_new">editBucket()</a></dt>
<dd><p>Runs when an edit button in the HTML bucket table is pressed.
Sets elements in bucket table to edit the bucket name.</p>
</dd>
<dt><a href="#BucketBudget.module_cancelBucketEdit_new">cancelBucketEdit()</a></dt>
<dd><p>Runs when a cancel button in the HTML bucket table is pressed.
Returns the row of the table to displaying the original bucket name.</p>
</dd>
<dt><a href="#BucketBudget.module_confirmBucketEdit_new">confirmBucketEdit()</a></dt>
<dd><p>Runs when submit changes button in the HTML bucket table is pressed.
Takes the new name of the bucket and changes it in USER_BUDGET if it isn&#39;t a duplicate.</p>
</dd>
<dt><a href="#BucketBudget.module_updateIncomeFilters_new">updateIncomeFilters()</a></dt>
<dd><p>Updates the income filter select option.</p>
</dd>
<dt><a href="#BucketBudget.module_validateIncomeFilterInputs_new">validateIncomeFilterInputs()</a></dt>
<dd><p>Run when add filter or submit changes for income filter button is pressed.
Validates income filter inputs before adding or editing filter.</p>
</dd>
<dt><a href="#BucketBudget.module_addIncomeFilter_new">addIncomeFilter()</a></dt>
<dd><p>Runs when add filter button is pressed after inputs are validated.
Takes the name of the filter, buckets, and percentages and adds an income filter to USER_BUDGET.</p>
</dd>
<dt><a href="#BucketBudget.module_removeIncomeFilter_new">removeIncomeFilter()</a></dt>
<dd><p>Runs when a remove filter button in the HTML income filter table is pressed.
Removes the selected income filter from USER_BUDGET.</p>
</dd>
<dt><a href="#BucketBudget.module_editIncomeFilter_new">editIncomeFilter()</a></dt>
<dd><p>Runs when the edit filter button in the HTML income filter table is pressed.
Enables editing the selected income filter using the income filter table.</p>
</dd>
<dt><a href="#BucketBudget.module_confirmIncomeFilterEdit_new">confirmIncomeFilterEdit()</a></dt>
<dd><p>Runs when a submit changes button in the HTML income filter table is pressed after validating input.
Attempts to make the changes to the income filter in USER_BUDGET if they are valid.</p>
</dd>
<dt><a href="#BucketBudget.module_incomeFilterCheck_new">incomeFilterCheck()</a></dt>
<dd><p>Does input validation and amount calculations for input filters before preview or use.</p>
</dd>
<dt><a href="#BucketBudget.module_previewIncomeFilter_new">previewIncomeFilter()</a></dt>
<dd><p>Uses selected filter and income to preview amount of money going into each bucket.</p>
</dd>
<dt><a href="#BucketBudget.module_useIncomeFilter_new">useIncomeFilter()</a></dt>
<dd><p>Uses selected filter and income to add money into the filter&#39;s buckets.</p>
</dd>
<dt><a href="#BucketBudget.module_addBucketToFilter_new">addBucketToFilter()</a></dt>
<dd><p>Adds new bucket input row to income filter.</p>
</dd>
<dt><a href="#BucketBudget.module_updateLedgerTable_new">updateLedgerTable()</a></dt>
<dd><p>Updates the HTML ledger table with the data in USER_BUDGET.
If a bucket no longer exists, a transaction will display the bucket ID.</p>
</dd>
<dt><a href="#BucketBudget.module_sortLedgerTable_new">sortLedgerTable()</a></dt>
<dd><p>Run when a column header button on the HTML ledger table is pressed.
Sorts the ledger by the chosen field.
Ascending/descending alternates if the same button is pressed multiple times.</p>
</dd>
<dt><a href="#BucketBudget.module_setLedgerPage_new">setLedgerPage()</a></dt>
<dd><p>Sets the current displayed ledger page based on the parameter given.</p>
</dd>
<dt><a href="#BucketBudget.module_setLedgerPageSize_new">setLedgerPageSize()</a></dt>
<dd><p>Sets the number of transactions displayed on one ledger page.</p>
</dd>
<dt><a href="#BucketBudget.module_addTransaction_new">addTransaction()</a></dt>
<dd><p>Run when add transaction button is pressed.
Takes values from the add new transaction section to add a new transaction to USER_BUDGET.</p>
</dd>
<dt><a href="#BucketBudget.module_removeTransaction_new">removeTransaction()</a></dt>
<dd><p>Run when a remove button on the HTML ledger table is pressed.
Removes the corresponding transaction from USER_BUDGET.</p>
</dd>
<dt><a href="#BucketBudget.module_editTransaction_new">editTransaction()</a></dt>
<dd><p>Runs when an edit button in the HTML ledger table is pressed.
Sets elements in ledger table to edit the transaction.</p>
</dd>
<dt><a href="#BucketBudget.module_cancelTransactionEdit_new">cancelTransactionEdit()</a></dt>
<dd><p>Runs when an cancel button in the HTML ledger table is pressed.
Returns the row of the table to displaying the original transaction fields.</p>
</dd>
<dt><a href="#BucketBudget.module_confirmBucketEdit_new">confirmBucketEdit()</a></dt>
<dd><p>Runs when submit changes button in the HTML ledger table is pressed.
Takes the new values for the transaction and changes it in USER_BUDGET if the field values are valid.</p>
</dd>
</dl>

<a name="module_BucketBudget"></a>

## BucketBudget

* [BucketBudget](#module_BucketBudget)
    * [~Bucket](#module_BucketBudget..Bucket)
        * [new Bucket(display_name, value)](#new_module_BucketBudget..Bucket_new)
        * [.display_name](#module_BucketBudget..Bucket+display_name) : <code>string</code>
        * [.value](#module_BucketBudget..Bucket+value) : <code>number</code>
        * [.modifyValue(value_modifier)](#module_BucketBudget..Bucket+modifyValue)
    * [~Transaction](#module_BucketBudget..Transaction)
        * [new Transaction(id, date, bucket, description, value, bucket_before)](#new_module_BucketBudget..Transaction_new)
        * _instance_
            * [.id](#module_BucketBudget..Transaction+id) : <code>number</code>
            * [.date](#module_BucketBudget..Transaction+date) : <code>string</code>
            * [.bucket](#module_BucketBudget..Transaction+bucket) : <code>string</code>
            * [.description](#module_BucketBudget..Transaction+description) : <code>string</code>
            * [.value](#module_BucketBudget..Transaction+value) : <code>number</code>
            * [.bucket_before](#module_BucketBudget..Transaction+bucket_before) : <code>number</code>
            * [.bucket_after](#module_BucketBudget..Transaction+bucket_after) : <code>number</code>
        * _static_
            * [.numericCompare(a, b, asc, field)](#module_BucketBudget..Transaction.numericCompare) ⇒ <code>number</code>
            * [.dateCompare(a, b, asc)](#module_BucketBudget..Transaction.dateCompare) ⇒ <code>number</code>
            * [.bucketCompare(a, b, asc)](#module_BucketBudget..Transaction.bucketCompare) ⇒ <code>number</code>
    * [~Ledger](#module_BucketBudget..Ledger)
        * [new Ledger()](#new_module_BucketBudget..Ledger_new)
        * [.transactions](#module_BucketBudget..Ledger+transactions) : <code>Dictionary.&lt;string, Transaction&gt;</code>
        * [.id_counter](#module_BucketBudget..Ledger+id_counter) : <code>number</code>
        * [.sort_field](#module_BucketBudget..Ledger+sort_field) : <code>string</code>
        * [.sort_dir_asc](#module_BucketBudget..Ledger+sort_dir_asc) : <code>boolean</code>
        * [.addTransaction(transaction)](#module_BucketBudget..Ledger+addTransaction) ⇒ <code>number</code>
        * [.removeTransaction(ledger_id)](#module_BucketBudget..Ledger+removeTransaction) ⇒ <code>number</code>
        * [.editTransaction(ledger_id, new_transaction)](#module_BucketBudget..Ledger+editTransaction) ⇒ <code>number</code>
        * [.sortLedger([field], [asc])](#module_BucketBudget..Ledger+sortLedger)
        * [.setLedgerSortParams(field, asc)](#module_BucketBudget..Ledger+setLedgerSortParams) ⇒ <code>boolean</code>
        * [.getAdjacentTransactions(ledger_id)](#module_BucketBudget..Ledger+getAdjacentTransactions) ⇒ <code>Array.&lt;string&gt;</code>
        * [.updateLedger(ledger_id)](#module_BucketBudget..Ledger+updateLedger) ⇒ <code>number</code>
        * [.updateBucketName(bucket, new_bucket_id, new_bucket_name)](#module_BucketBudget..Ledger+updateBucketName)
    * [~IncomeFilter](#module_BucketBudget..IncomeFilter)
        * [new IncomeFilter(display_name, [bucket_ids], [percentages], rounding_bucket)](#new_module_BucketBudget..IncomeFilter_new)
        * [.display_name](#module_BucketBudget..IncomeFilter+display_name) : <code>string</code>
        * [.bucket_percentages](#module_BucketBudget..IncomeFilter+bucket_percentages) : <code>Dictionary.&lt;string, number&gt;</code>
        * [.bucket_percentages](#module_BucketBudget..IncomeFilter+bucket_percentages) : <code>string</code>
        * [.setBucketPercentages(bucket_ids, percentages)](#module_BucketBudget..IncomeFilter+setBucketPercentages) ⇒ <code>boolean</code>
        * [.setRoundingBucket(rounding_bucket)](#module_BucketBudget..IncomeFilter+setRoundingBucket) ⇒ <code>boolean</code>
        * [.updateBucketName(bucket_id, new_bucket_id)](#module_BucketBudget..IncomeFilter+updateBucketName)
    * [~Budget](#module_BucketBudget..Budget)
        * [new Budget()](#new_module_BucketBudget..Budget_new)
        * [.buckets](#module_BucketBudget..Budget+buckets) : <code>Dictionary.&lt;string, Bucket&gt;</code>
        * [.income_filters](#module_BucketBudget..Budget+income_filters) : <code>Dictionary.&lt;string, IncomeFilter&gt;</code>
        * [.ledger](#module_BucketBudget..Budget+ledger) : <code>Ledger</code>
        * [.page](#module_BucketBudget..Budget+page) : <code>number</code>
        * [.page_size](#module_BucketBudget..Budget+page_size) : <code>number</code>
        * [.addBucket(name, value)](#module_BucketBudget..Budget+addBucket) ⇒ <code>boolean</code>
        * [.removeBucket(bucket_id)](#module_BucketBudget..Budget+removeBucket) ⇒ <code>boolean</code>
        * [.editBucket(bucket_id, new_bucket_name)](#module_BucketBudget..Budget+editBucket) ⇒ <code>boolean</code>
        * [.addIncomeFilter(filter_name, bucket_ids, percentages, rounding_bucket)](#module_BucketBudget..Budget+addIncomeFilter) ⇒ <code>boolean</code>
        * [.removeIncomeFilter(filter_id)](#module_BucketBudget..Budget+removeIncomeFilter) ⇒ <code>boolean</code>
        * [.editIncomeFilter(filter_id, new_filter_name, bucket_ids, percentages, rounding_bucket)](#module_BucketBudget..Budget+editIncomeFilter) ⇒ <code>boolean</code>
        * [.addTransaction(date, bucket, description, value)](#module_BucketBudget..Budget+addTransaction) ⇒ <code>boolean</code>
        * [.removeTransaction(transaction_id)](#module_BucketBudget..Budget+removeTransaction) ⇒ <code>boolean</code>
        * [.editTransaction(date, bucket, description, value, transaction_id)](#module_BucketBudget..Budget+editTransaction) ⇒ <code>boolean</code>
        * [.sortLedger()](#module_BucketBudget..Budget+sortLedger) ⇒ <code>boolean</code>
        * [.setLedgerSortParams(sort_field, sort_dir_asc)](#module_BucketBudget..Budget+setLedgerSortParams) ⇒ <code>boolean</code>
        * [.setLedgerPage(page)](#module_BucketBudget..Budget+setLedgerPage) ⇒ <code>boolean</code>
        * [.setLedgerPageSize(page)](#module_BucketBudget..Budget+setLedgerPageSize) ⇒ <code>boolean</code>
    * [~exportDataFile](#module_BucketBudget..exportDataFile) : <code>string</code>
    * [~USER_BUDGET](#module_BucketBudget..USER_BUDGET) : <code>Budget</code>
    * [~valid_sort_fields](#module_BucketBudget..valid_sort_fields) : <code>Array.&lt;string&gt;</code>
    * [~valid_file_import_types](#module_BucketBudget..valid_file_import_types) : <code>Array.&lt;string&gt;</code>
    * [~formatter](#module_BucketBudget..formatter) : <code>Intl.NumberFormat</code>

<a name="module_BucketBudget..Bucket"></a>

### BucketBudget~Bucket
**Kind**: inner class of [<code>BucketBudget</code>](#module_BucketBudget)  

* [~Bucket](#module_BucketBudget..Bucket)
    * [new Bucket(display_name, value)](#new_module_BucketBudget..Bucket_new)
    * [.display_name](#module_BucketBudget..Bucket+display_name) : <code>string</code>
    * [.value](#module_BucketBudget..Bucket+value) : <code>number</code>
    * [.modifyValue(value_modifier)](#module_BucketBudget..Bucket+modifyValue)

<a name="new_module_BucketBudget..Bucket_new"></a>

#### new Bucket(display_name, value)
Bucket Constructor


| Param | Type | Description |
| --- | --- | --- |
| display_name | <code>string</code> | Name of the bucket. |
| value | <code>number</code> | Value (amount of money) in the bucket rounded to 2 decimal places. |

<a name="module_BucketBudget..Bucket+display_name"></a>

#### bucket.display\_name : <code>string</code>
Name of the bucket.

**Kind**: instance property of [<code>Bucket</code>](#module_BucketBudget..Bucket)  
<a name="module_BucketBudget..Bucket+value"></a>

#### bucket.value : <code>number</code>
Value (amount of money) in the bucket rounded to 2 decimal places.

**Kind**: instance property of [<code>Bucket</code>](#module_BucketBudget..Bucket)  
<a name="module_BucketBudget..Bucket+modifyValue"></a>

#### bucket.modifyValue(value_modifier)
Modifies a bucket's value.

**Kind**: instance method of [<code>Bucket</code>](#module_BucketBudget..Bucket)  

| Param | Type | Description |
| --- | --- | --- |
| value_modifier | <code>number</code> | How much money is being added or removed from the bucket. |

<a name="module_BucketBudget..Transaction"></a>

### BucketBudget~Transaction
**Kind**: inner class of [<code>BucketBudget</code>](#module_BucketBudget)  

* [~Transaction](#module_BucketBudget..Transaction)
    * [new Transaction(id, date, bucket, description, value, bucket_before)](#new_module_BucketBudget..Transaction_new)
    * _instance_
        * [.id](#module_BucketBudget..Transaction+id) : <code>number</code>
        * [.date](#module_BucketBudget..Transaction+date) : <code>string</code>
        * [.bucket](#module_BucketBudget..Transaction+bucket) : <code>string</code>
        * [.description](#module_BucketBudget..Transaction+description) : <code>string</code>
        * [.value](#module_BucketBudget..Transaction+value) : <code>number</code>
        * [.bucket_before](#module_BucketBudget..Transaction+bucket_before) : <code>number</code>
        * [.bucket_after](#module_BucketBudget..Transaction+bucket_after) : <code>number</code>
    * _static_
        * [.numericCompare(a, b, asc, field)](#module_BucketBudget..Transaction.numericCompare) ⇒ <code>number</code>
        * [.dateCompare(a, b, asc)](#module_BucketBudget..Transaction.dateCompare) ⇒ <code>number</code>
        * [.bucketCompare(a, b, asc)](#module_BucketBudget..Transaction.bucketCompare) ⇒ <code>number</code>

<a name="new_module_BucketBudget..Transaction_new"></a>

#### new Transaction(id, date, bucket, description, value, bucket_before)
Transaction Constructor


| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | Identifying number for the transaction. |
| date | <code>string</code> | Date the transaction occurred in YYYY-MM-DD format. |
| bucket | <code>string</code> | The bucket this transaction is in. Budget.buckets is used to get the Bucket object associated with this. |
| description | <code>string</code> | Description of the transaction. Generally 128 characters or shorter. |
| value | <code>number</code> | Value of the transaction rounded to 2 decimal places. |
| bucket_before | <code>number</code> | Value of the associated bucket prior to this transaction. |

<a name="module_BucketBudget..Transaction+id"></a>

#### transaction.id : <code>number</code>
Identifying number for the transaction.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction+date"></a>

#### transaction.date : <code>string</code>
Date the transaction occurred in YYYY-MM-DD format.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction+bucket"></a>

#### transaction.bucket : <code>string</code>
The bucket this transaction is in.
Budget.buckets is used to get the Bucket object associated with this.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction+description"></a>

#### transaction.description : <code>string</code>
Description of the transaction. Generally 128 characters or shorter.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction+value"></a>

#### transaction.value : <code>number</code>
Value of the transaction rounded to 2 decimal places.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction+bucket_before"></a>

#### transaction.bucket\_before : <code>number</code>
Value of the associated bucket prior to this transaction.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction+bucket_after"></a>

#### transaction.bucket\_after : <code>number</code>
Value of the associated bucket after this transaction.

**Kind**: instance property of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
<a name="module_BucketBudget..Transaction.numericCompare"></a>

#### Transaction.numericCompare(a, b, asc, field) ⇒ <code>number</code>
Returns comparison of transactions by a numerical field.
(-1)^(1+asc) * a + (-1)^(asc) * b = {a-b if asc=true; b-a if asc=false}

**Kind**: static method of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
**Returns**: <code>number</code> - Numerical sort value that is negative if a < b, 0 if a=b, positive if a > b
(pos and neg switch if asc is false).  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Transaction</code> | First Transaction to compare fields. |
| b | <code>Transaction</code> | Second Transaction to compare fields. |
| asc | <code>boolean</code> | True if comparison is ascending, false otherwise. |
| field | <code>string</code> | Numeric field to sort by. |

<a name="module_BucketBudget..Transaction.dateCompare"></a>

#### Transaction.dateCompare(a, b, asc) ⇒ <code>number</code>
Returns comparison of transaction dates and ids.

**Kind**: static method of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
**Returns**: <code>number</code> - Numerical sort value that is negative if a < b, 0 if a=b, positive if a > b
(pos and neg switch if asc is false).  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Transaction</code> | First Transaction to compare dates. |
| b | <code>Transaction</code> | Second Transaction to compare dates. |
| asc | <code>boolean</code> | True if comparison is ascending, false otherwise. |

<a name="module_BucketBudget..Transaction.bucketCompare"></a>

#### Transaction.bucketCompare(a, b, asc) ⇒ <code>number</code>
Returns alphabetic comparison of transaction buckets.

**Kind**: static method of [<code>Transaction</code>](#module_BucketBudget..Transaction)  
**Returns**: <code>number</code> - Numerical sort value that is negative if a < b, 0 if a=b, positive if a > b
(pos and neg switch if asc is false).  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>Transaction</code> | First Transaction to compare buckets. |
| b | <code>Transaction</code> | Second Transaction to compare buckets. |
| asc | <code>boolean</code> | True if comparison is ascending, false otherwise. |

<a name="module_BucketBudget..Ledger"></a>

### BucketBudget~Ledger
**Kind**: inner class of [<code>BucketBudget</code>](#module_BucketBudget)  

* [~Ledger](#module_BucketBudget..Ledger)
    * [new Ledger()](#new_module_BucketBudget..Ledger_new)
    * [.transactions](#module_BucketBudget..Ledger+transactions) : <code>Dictionary.&lt;string, Transaction&gt;</code>
    * [.id_counter](#module_BucketBudget..Ledger+id_counter) : <code>number</code>
    * [.sort_field](#module_BucketBudget..Ledger+sort_field) : <code>string</code>
    * [.sort_dir_asc](#module_BucketBudget..Ledger+sort_dir_asc) : <code>boolean</code>
    * [.addTransaction(transaction)](#module_BucketBudget..Ledger+addTransaction) ⇒ <code>number</code>
    * [.removeTransaction(ledger_id)](#module_BucketBudget..Ledger+removeTransaction) ⇒ <code>number</code>
    * [.editTransaction(ledger_id, new_transaction)](#module_BucketBudget..Ledger+editTransaction) ⇒ <code>number</code>
    * [.sortLedger([field], [asc])](#module_BucketBudget..Ledger+sortLedger)
    * [.setLedgerSortParams(field, asc)](#module_BucketBudget..Ledger+setLedgerSortParams) ⇒ <code>boolean</code>
    * [.getAdjacentTransactions(ledger_id)](#module_BucketBudget..Ledger+getAdjacentTransactions) ⇒ <code>Array.&lt;string&gt;</code>
    * [.updateLedger(ledger_id)](#module_BucketBudget..Ledger+updateLedger) ⇒ <code>number</code>
    * [.updateBucketName(bucket, new_bucket_id, new_bucket_name)](#module_BucketBudget..Ledger+updateBucketName)

<a name="new_module_BucketBudget..Ledger_new"></a>

#### new Ledger()
Creates an empty Ledger with:
- id_counter = 0
- sort_field = "date"
- sort_dir_asc = false

<a name="module_BucketBudget..Ledger+transactions"></a>

#### ledger.transactions : <code>Dictionary.&lt;string, Transaction&gt;</code>
Transactions accessed by ledger ID.

**Kind**: instance property of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
<a name="module_BucketBudget..Ledger+id_counter"></a>

#### ledger.id\_counter : <code>number</code>
Counter used to determine the ledger and transaction IDs for new transactions.

**Kind**: instance property of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
<a name="module_BucketBudget..Ledger+sort_field"></a>

#### ledger.sort\_field : <code>string</code>
The field the ledger is being sorted by.

**Kind**: instance property of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
<a name="module_BucketBudget..Ledger+sort_dir_asc"></a>

#### ledger.sort\_dir\_asc : <code>boolean</code>
True if ledger sorted in ascending order, false otherwise.

**Kind**: instance property of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
<a name="module_BucketBudget..Ledger+addTransaction"></a>

#### ledger.addTransaction(transaction) ⇒ <code>number</code>
Adds new transaction to the ledger's dictionary.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
**Returns**: <code>number</code> - The new value of the bucket associated with the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| transaction | <code>Transaction</code> | The transaction to add to the ledger. |

<a name="module_BucketBudget..Ledger+removeTransaction"></a>

#### ledger.removeTransaction(ledger_id) ⇒ <code>number</code>
Removes a transaction from the ledger's dictionary.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
**Returns**: <code>number</code> - The new value of the bucket associated with the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| ledger_id | <code>string</code> | ID (key) associated with the transaction to remove. |

<a name="module_BucketBudget..Ledger+editTransaction"></a>

#### ledger.editTransaction(ledger_id, new_transaction) ⇒ <code>number</code>
Edits a transaction already in the ledger's dictionary.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
**Returns**: <code>number</code> - The new value of the bucket associated with the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| ledger_id | <code>string</code> | ID (key) associated with the transaction to remove. |
| new_transaction | <code>Transaction</code> | Transaction containing the new values to be set. |

<a name="module_BucketBudget..Ledger+sortLedger"></a>

#### ledger.sortLedger([field], [asc])
Sorts the transactions dictionary by a field in ascending or descending order.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [field] | <code>string</code> | <code>&quot;this.sort_field&quot;</code> | The field to sort the ledger by. |
| [asc] | <code>boolean</code> | <code>this.sort_dir_asc</code> | True if ledger sorted in ascending order, false otherwise. |

<a name="module_BucketBudget..Ledger+setLedgerSortParams"></a>

#### ledger.setLedgerSortParams(field, asc) ⇒ <code>boolean</code>
Sets the sorting parameters of the ledger.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
**Returns**: <code>boolean</code> - False if field or parameter types are invalid, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | The field the ledger should be sorted by. |
| asc | <code>boolean</code> | True if ledger sorted in ascending order, false otherwise. |

<a name="module_BucketBudget..Ledger+getAdjacentTransactions"></a>

#### ledger.getAdjacentTransactions(ledger_id) ⇒ <code>Array.&lt;string&gt;</code>
Given a transaction, finds the transactions before and after it within the same bucket.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
**Returns**: <code>Array.&lt;string&gt;</code> - [before_id,after_id] -
The ledger IDs (keys) of the transactions before and after within the associated bucket.
The before_id will be ledger_id if the transaction is the first in the bucket.
The after_id will be ledger_id if the transaction is the last in the bucket.  

| Param | Type | Description |
| --- | --- | --- |
| ledger_id | <code>string</code> | The ledger ID (key) of the transaction to get adjacent transactions from. |

<a name="module_BucketBudget..Ledger+updateLedger"></a>

#### ledger.updateLedger(ledger_id) ⇒ <code>number</code>
Updates all ledger transactions in the bucket of the inputted transaction.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  
**Returns**: <code>number</code> - The new bucket value after updating transactions.  

| Param | Type | Description |
| --- | --- | --- |
| ledger_id | <code>string</code> | The ledger ID (key) of the transaction start updating from. |

<a name="module_BucketBudget..Ledger+updateBucketName"></a>

#### ledger.updateBucketName(bucket, new_bucket_id, new_bucket_name)
Goes through each transaction in the ledger and updates the bucket if applicable.

**Kind**: instance method of [<code>Ledger</code>](#module_BucketBudget..Ledger)  

| Param | Type | Description |
| --- | --- | --- |
| bucket | <code>Bucket</code> | The bucket existing transactions are in. |
| new_bucket_id | <code>string</code> | The new ID for the bucket. |
| new_bucket_name | <code>string</code> | The new display name for the bucket |

<a name="module_BucketBudget..IncomeFilter"></a>

### BucketBudget~IncomeFilter
**Kind**: inner class of [<code>BucketBudget</code>](#module_BucketBudget)  

* [~IncomeFilter](#module_BucketBudget..IncomeFilter)
    * [new IncomeFilter(display_name, [bucket_ids], [percentages], rounding_bucket)](#new_module_BucketBudget..IncomeFilter_new)
    * [.display_name](#module_BucketBudget..IncomeFilter+display_name) : <code>string</code>
    * [.bucket_percentages](#module_BucketBudget..IncomeFilter+bucket_percentages) : <code>Dictionary.&lt;string, number&gt;</code>
    * [.bucket_percentages](#module_BucketBudget..IncomeFilter+bucket_percentages) : <code>string</code>
    * [.setBucketPercentages(bucket_ids, percentages)](#module_BucketBudget..IncomeFilter+setBucketPercentages) ⇒ <code>boolean</code>
    * [.setRoundingBucket(rounding_bucket)](#module_BucketBudget..IncomeFilter+setRoundingBucket) ⇒ <code>boolean</code>
    * [.updateBucketName(bucket_id, new_bucket_id)](#module_BucketBudget..IncomeFilter+updateBucketName)

<a name="new_module_BucketBudget..IncomeFilter_new"></a>

#### new IncomeFilter(display_name, [bucket_ids], [percentages], rounding_bucket)
IncomeFilter Constructer.
Creates empty IncomeFilter if parameters invalid or not given.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| display_name | <code>string</code> |  | The display name of the IncomeFilter. This will be used as the description for transactions added using the filter. |
| [bucket_ids] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | The ID of each Bucket that the income will go into. bucket_ids[i] should correspond with percentages[i]. |
| [percentages] | <code>Array.&lt;number&gt;</code> | <code>[]</code> | The percentages of income to go into each bucket rounded to 2 decimal places. percentages[i] should correspond with bucket_ids[i]. |
| rounding_bucket | <code>string</code> |  | The ID of the bucket that will be affected by any (+ or -) rounding errors. |

<a name="module_BucketBudget..IncomeFilter+display_name"></a>

#### incomeFilter.display\_name : <code>string</code>
Name of the IncomeFilter.
This will be used as the description for transactions added using the filter.

**Kind**: instance property of [<code>IncomeFilter</code>](#module_BucketBudget..IncomeFilter)  
<a name="module_BucketBudget..IncomeFilter+bucket_percentages"></a>

#### incomeFilter.bucket\_percentages : <code>Dictionary.&lt;string, number&gt;</code>
Filter percentages accessed by Bucket ID.

**Kind**: instance property of [<code>IncomeFilter</code>](#module_BucketBudget..IncomeFilter)  
<a name="module_BucketBudget..IncomeFilter+bucket_percentages"></a>

#### incomeFilter.bucket\_percentages : <code>string</code>
The ID of the bucket that will be affected by any rounding errors, positive or negative.

**Kind**: instance property of [<code>IncomeFilter</code>](#module_BucketBudget..IncomeFilter)  
<a name="module_BucketBudget..IncomeFilter+setBucketPercentages"></a>

#### incomeFilter.setBucketPercentages(bucket_ids, percentages) ⇒ <code>boolean</code>
Sets percentages to the filter.

**Kind**: instance method of [<code>IncomeFilter</code>](#module_BucketBudget..IncomeFilter)  
**Returns**: <code>boolean</code> - False if percentages don't add to 100.00 or
bucket_ids.length != percentages.length, True otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| bucket_ids | <code>Array.&lt;string&gt;</code> | The ID of each Bucket that the income will go into. bucket_ids[i] should correspond with percentages[i]. |
| percentages | <code>Array.&lt;number&gt;</code> | The percentages of income to go into each bucket rounded to 2 decimal places. percentages[i] should correspond with bucket_ids[i]. |

<a name="module_BucketBudget..IncomeFilter+setRoundingBucket"></a>

#### incomeFilter.setRoundingBucket(rounding_bucket) ⇒ <code>boolean</code>
Sets the rounding bucket

**Kind**: instance method of [<code>IncomeFilter</code>](#module_BucketBudget..IncomeFilter)  
**Returns**: <code>boolean</code> - False if rounding bucket is not used in filter, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| rounding_bucket | <code>string</code> | The ID of the bucket that will be affected by any (+ or -) rounding errors. |

<a name="module_BucketBudget..IncomeFilter+updateBucketName"></a>

#### incomeFilter.updateBucketName(bucket_id, new_bucket_id)
Goes through each percentage in the filter and updates the bucket if applicable.

**Kind**: instance method of [<code>IncomeFilter</code>](#module_BucketBudget..IncomeFilter)  

| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | The ID of the bucket to rename. |
| new_bucket_id | <code>string</code> | The new ID for the bucket. |

<a name="module_BucketBudget..Budget"></a>

### BucketBudget~Budget
**Kind**: inner class of [<code>BucketBudget</code>](#module_BucketBudget)  

* [~Budget](#module_BucketBudget..Budget)
    * [new Budget()](#new_module_BucketBudget..Budget_new)
    * [.buckets](#module_BucketBudget..Budget+buckets) : <code>Dictionary.&lt;string, Bucket&gt;</code>
    * [.income_filters](#module_BucketBudget..Budget+income_filters) : <code>Dictionary.&lt;string, IncomeFilter&gt;</code>
    * [.ledger](#module_BucketBudget..Budget+ledger) : <code>Ledger</code>
    * [.page](#module_BucketBudget..Budget+page) : <code>number</code>
    * [.page_size](#module_BucketBudget..Budget+page_size) : <code>number</code>
    * [.addBucket(name, value)](#module_BucketBudget..Budget+addBucket) ⇒ <code>boolean</code>
    * [.removeBucket(bucket_id)](#module_BucketBudget..Budget+removeBucket) ⇒ <code>boolean</code>
    * [.editBucket(bucket_id, new_bucket_name)](#module_BucketBudget..Budget+editBucket) ⇒ <code>boolean</code>
    * [.addIncomeFilter(filter_name, bucket_ids, percentages, rounding_bucket)](#module_BucketBudget..Budget+addIncomeFilter) ⇒ <code>boolean</code>
    * [.removeIncomeFilter(filter_id)](#module_BucketBudget..Budget+removeIncomeFilter) ⇒ <code>boolean</code>
    * [.editIncomeFilter(filter_id, new_filter_name, bucket_ids, percentages, rounding_bucket)](#module_BucketBudget..Budget+editIncomeFilter) ⇒ <code>boolean</code>
    * [.addTransaction(date, bucket, description, value)](#module_BucketBudget..Budget+addTransaction) ⇒ <code>boolean</code>
    * [.removeTransaction(transaction_id)](#module_BucketBudget..Budget+removeTransaction) ⇒ <code>boolean</code>
    * [.editTransaction(date, bucket, description, value, transaction_id)](#module_BucketBudget..Budget+editTransaction) ⇒ <code>boolean</code>
    * [.sortLedger()](#module_BucketBudget..Budget+sortLedger) ⇒ <code>boolean</code>
    * [.setLedgerSortParams(sort_field, sort_dir_asc)](#module_BucketBudget..Budget+setLedgerSortParams) ⇒ <code>boolean</code>
    * [.setLedgerPage(page)](#module_BucketBudget..Budget+setLedgerPage) ⇒ <code>boolean</code>
    * [.setLedgerPageSize(page)](#module_BucketBudget..Budget+setLedgerPageSize) ⇒ <code>boolean</code>

<a name="new_module_BucketBudget..Budget_new"></a>

#### new Budget()
Creates an empty budget.

<a name="module_BucketBudget..Budget+buckets"></a>

#### budget.buckets : <code>Dictionary.&lt;string, Bucket&gt;</code>
Buckets accessed by bucket ID.

**Kind**: instance property of [<code>Budget</code>](#module_BucketBudget..Budget)  
<a name="module_BucketBudget..Budget+income_filters"></a>

#### budget.income\_filters : <code>Dictionary.&lt;string, IncomeFilter&gt;</code>
IncomeFilters accessed by filter ID.

**Kind**: instance property of [<code>Budget</code>](#module_BucketBudget..Budget)  
<a name="module_BucketBudget..Budget+ledger"></a>

#### budget.ledger : <code>Ledger</code>
The Budget's ledger.

**Kind**: instance property of [<code>Budget</code>](#module_BucketBudget..Budget)  
<a name="module_BucketBudget..Budget+page"></a>

#### budget.page : <code>number</code>
The current page of the ledger.

**Kind**: instance property of [<code>Budget</code>](#module_BucketBudget..Budget)  
<a name="module_BucketBudget..Budget+page_size"></a>

#### budget.page\_size : <code>number</code>
The current page size of the ledger.

**Kind**: instance property of [<code>Budget</code>](#module_BucketBudget..Budget)  
<a name="module_BucketBudget..Budget+addBucket"></a>

#### budget.addBucket(name, value) ⇒ <code>boolean</code>
Adds a new bucket to the dictionary.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if name results in duplicate bucket, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The display name of the bucket. |
| value | <code>number</code> | Value (amount of money) in the bucket. |

<a name="module_BucketBudget..Budget+removeBucket"></a>

#### budget.removeBucket(bucket_id) ⇒ <code>boolean</code>
Removes a bucket from the dictionary.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if bucket ID doesnt exist, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | The bucket ID (key) of the bucket to remove. |

<a name="module_BucketBudget..Budget+editBucket"></a>

#### budget.editBucket(bucket_id, new_bucket_name) ⇒ <code>boolean</code>
Edits an existing bucket in the dictionary and updates transactions in ledger to have updated bucket.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if new name causes a duplicate ID, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | The bucket ID (key) of the bucket to edit. |
| new_bucket_name | <code>string</code> | New display name for the bucket. |

<a name="module_BucketBudget..Budget+addIncomeFilter"></a>

#### budget.addIncomeFilter(filter_name, bucket_ids, percentages, rounding_bucket) ⇒ <code>boolean</code>
Attempts to add a new IncomeFilter.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if percentages don't add to 100.00, bucket_ids.length != percentages.length,
bucket_ids/rounding bucket are not present within the budget, rounding bucket not in filter,
or filter_name is duplicate, True otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| filter_name | <code>string</code> | The name of the IncomeFilter. |
| bucket_ids | <code>Array.&lt;string&gt;</code> | The ID of each Bucket that the income will go into. bucket_ids[i] should correspond with percentages[i]. |
| percentages | <code>Array.&lt;number&gt;</code> | The percentages of income to go into each bucket rounded to 2 decimal places. percentages[i] should correspond with bucket_ids[i]. |
| rounding_bucket | <code>string</code> | The ID of the bucket that will be affected by any (+ or -) rounding errors. |

<a name="module_BucketBudget..Budget+removeIncomeFilter"></a>

#### budget.removeIncomeFilter(filter_id) ⇒ <code>boolean</code>
Removes an IncomeFilter from the dictionary.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if filter ID doesn't exist, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| filter_id | <code>string</code> | The filter ID (key) of the filter to remove. |

<a name="module_BucketBudget..Budget+editIncomeFilter"></a>

#### budget.editIncomeFilter(filter_id, new_filter_name, bucket_ids, percentages, rounding_bucket) ⇒ <code>boolean</code>
Attempts to edit an existing IncomeFilter in the dictionary.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if percentages don't add to 100.00, bucket_ids.length != percentages.length,
bucket_ids are not present within the budget, or filter_name is duplicate, True otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| filter_id | <code>string</code> | The filter ID (key) of the filter to edit. |
| new_filter_name | <code>string</code> | The name of the IncomeFilter. |
| bucket_ids | <code>Array.&lt;string&gt;</code> | The ID of each Bucket that the income will go into. bucket_ids[i] should correspond with percentages[i]. |
| percentages | <code>Array.&lt;number&gt;</code> | The percentages of income to go into each bucket rounded to 2 decimal places. percentages[i] should correspond with bucket_ids[i]. |
| rounding_bucket | <code>string</code> | The ID of the bucket that will be affected by any (+ or -) rounding errors. |

<a name="module_BucketBudget..Budget+addTransaction"></a>

#### budget.addTransaction(date, bucket, description, value) ⇒ <code>boolean</code>
Adds a transaction to the ledger.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - Returns true after adding transaction to ledger.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | Date the transaction occurred in YYYY-MM-DD format. |
| bucket | <code>string</code> | The bucket ID of the bucket this transaction is in. |
| description | <code>string</code> | Description of the transaction. Generally 128 characters or shorter. |
| value | <code>number</code> | Value of the transaction rounded to 2 decimal places. |

<a name="module_BucketBudget..Budget+removeTransaction"></a>

#### budget.removeTransaction(transaction_id) ⇒ <code>boolean</code>
Removes a transaction from the ledger and updates the value of the bucket it was in.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - Returns true after removing the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| transaction_id | <code>string</code> | ID (key) of the transaction being removed. |

<a name="module_BucketBudget..Budget+editTransaction"></a>

#### budget.editTransaction(date, bucket, description, value, transaction_id) ⇒ <code>boolean</code>
Edits a ledger transaction and updates affected bucket values.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - Returns true after editing the transaction.  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>string</code> | Date the transaction occurred in YYYY-MM-DD format. |
| bucket | <code>string</code> | The bucket this transaction is in. Budget.buckets is used to get the Bucket object associated with this. |
| description | <code>string</code> | Description of the transaction. Generally 128 characters or shorter. |
| value | <code>number</code> | Value of the transaction rounded to 2 decimal places. |
| transaction_id | <code>string</code> | ID (key) of the transaction being edited. |

<a name="module_BucketBudget..Budget+sortLedger"></a>

#### budget.sortLedger() ⇒ <code>boolean</code>
Sorts the ledger by its sorting parameters.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - Returns true after sorting the ledger.  
<a name="module_BucketBudget..Budget+setLedgerSortParams"></a>

#### budget.setLedgerSortParams(sort_field, sort_dir_asc) ⇒ <code>boolean</code>
Sets the sorting parameters of the ledger.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False if field or parameter types are invalid, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| sort_field | <code>string</code> | The field the ledger should be sorted by. |
| sort_dir_asc | <code>boolean</code> | True if ledger sorted in ascending order, false otherwise. |

<a name="module_BucketBudget..Budget+setLedgerPage"></a>

#### budget.setLedgerPage(page) ⇒ <code>boolean</code>
Sets the ledger page.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False invalid page number, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>number</code> | The page to set the ledger to. |

<a name="module_BucketBudget..Budget+setLedgerPageSize"></a>

#### budget.setLedgerPageSize(page) ⇒ <code>boolean</code>
Sets the ledger page size.

**Kind**: instance method of [<code>Budget</code>](#module_BucketBudget..Budget)  
**Returns**: <code>boolean</code> - False invalid page size, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| page | <code>number</code> | The integer number of transactions for each ledger page. |

<a name="module_BucketBudget..exportDataFile"></a>

### BucketBudget~exportDataFile : <code>string</code>
The object URL of the exported budget data file.

**Kind**: inner property of [<code>BucketBudget</code>](#module_BucketBudget)  
<a name="module_BucketBudget..USER_BUDGET"></a>

### BucketBudget~USER\_BUDGET : <code>Budget</code>
The budget being modified by the HTML interface.

**Kind**: inner property of [<code>BucketBudget</code>](#module_BucketBudget)  
<a name="module_BucketBudget..valid_sort_fields"></a>

### BucketBudget~valid\_sort\_fields : <code>Array.&lt;string&gt;</code>
List of fields that can be sorted by.

**Kind**: inner constant of [<code>BucketBudget</code>](#module_BucketBudget)  
<a name="module_BucketBudget..valid_file_import_types"></a>

### BucketBudget~valid\_file\_import\_types : <code>Array.&lt;string&gt;</code>
The file types currently supported by the import functions.

**Kind**: inner constant of [<code>BucketBudget</code>](#module_BucketBudget)  
<a name="module_BucketBudget..formatter"></a>

### BucketBudget~formatter : <code>Intl.NumberFormat</code>
Formats numbers to currency for proper display.

**Kind**: inner constant of [<code>BucketBudget</code>](#module_BucketBudget)  
<a name="BucketBudget.module_importValidationJSONBuckets_new"></a>

## importValidationJSONBuckets()
Validates imported JSON buckets and adds them to the imported_budget.


| Param | Type | Description |
| --- | --- | --- |
| imported_budget | <code>Budget</code> | The constructed budget to add buckets to. |
| JSON_object | <code>Object</code> | The imported JSON Object. |
| invalid_JSON | <code>boolean</code> | Value to keep track of any JSON malformities. |

<a name="BucketBudget.module_importValidationJSONIncomeFiltersBucketPercentages_new"></a>

## importValidationJSONIncomeFiltersBucketPercentages() ⇒ <code>Object</code>
Validates imported JSON income filter bucket percentages.

**Returns**: <code>Object</code> - [bucket_ids, percentages] - The bucket IDs and percentages for the filter.  

| Param | Type | Description |
| --- | --- | --- |
| imported_budget | <code>Budget</code> | The constructed budget so far. |
| curr_filter | <code>Object</code> | JSON object containing unvalidated filter. |
| invalid_JSON | <code>boolean</code> | Value to keep track of any JSON malformities. |

<a name="BucketBudget.module_importValidationJSONIncomeFilters_new"></a>

## importValidationJSONIncomeFilters()
Validates imported JSON income filters and adds them to the imported_budget.


| Param | Type | Description |
| --- | --- | --- |
| imported_budget | <code>Budget</code> | The constructed budget to add filters to. |
| JSON_object | <code>Object</code> | The imported JSON Object. |
| invalid_JSON | <code>boolean</code> | Value to keep track of any JSON malformities. |

<a name="BucketBudget.module_importValidationJSONLedger_new"></a>

## importValidationJSONLedger()
Validates imported JSON ledger and adds it to the imported_budget.


| Param | Type | Description |
| --- | --- | --- |
| imported_budget | <code>Budget</code> | The constructed budget to add ledger to. |
| JSON_object | <code>Object</code> | The imported JSON Object. |
| invalid_JSON | <code>boolean</code> | Value to keep track of any JSON malformities. |

<a name="BucketBudget.module_importJSON_new"></a>

## importJSON() ⇒ <code>bool</code>
Imports a budget from a JSON object.

**Returns**: <code>bool</code> - False if the JSON object is not formatted as a correct Budget, true otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | JSON object gotten from the reader. Ideally a Budget. |

<a name="BucketBudget.module_exportJSON_new"></a>

## exportJSON()
Exports a Budget to a JSON file and creates an object URL for it, saving it in exportDataFile.


| Param | Type | Description |
| --- | --- | --- |
| budget | <code>Budget</code> | The Budget to export. |

<a name="BucketBudget.module_importData_new"></a>

## importData()
Runs when import button is pressed.
Imports the uploaded data file and sets USER_BUDGET equal to it.

<a name="BucketBudget.module_exportData_new"></a>

## exportData()
Runs when export button is pressed.
Exports USER_BUDGET and downloads it to the user's machine.


| Param | Type | Description |
| --- | --- | --- |
| filetype | <code>string</code> | The file extension for the exported file, decided by the export button. |

<a name="BucketBudget.module_updateBucketTable_new"></a>

## updateBucketTable()
Updates the HTML bucket table with the data in USER_BUDGET.

<a name="BucketBudget.module_addBucket_new"></a>

## addBucket()
Runs when add bucket button is pressed.
Adds a bucket to USER_BUDGET using the name from the text input.

<a name="BucketBudget.module_removeBucket_new"></a>

## removeBucket()
Runs when a remove button in the HTML bucket table is pressed.
Removes bucket from USER_BUDGET.


| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | ID (key) of the bucket to be removed from USER_BUDGET. |

<a name="BucketBudget.module_editBucket_new"></a>

## editBucket()
Runs when an edit button in the HTML bucket table is pressed.
Sets elements in bucket table to edit the bucket name.


| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | ID (key) of the bucket to be edited. |
| edit_button | <code>Object</code> | The edit button that was pressed. |

<a name="BucketBudget.module_cancelBucketEdit_new"></a>

## cancelBucketEdit()
Runs when a cancel button in the HTML bucket table is pressed.
Returns the row of the table to displaying the original bucket name.


| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | ID (key) of the bucket being edited. |
| cancel_button | <code>Object</code> | The cancel button that was pressed. |

<a name="BucketBudget.module_confirmBucketEdit_new"></a>

## confirmBucketEdit()
Runs when submit changes button in the HTML bucket table is pressed.
Takes the new name of the bucket and changes it in USER_BUDGET if it isn't a duplicate.


| Param | Type | Description |
| --- | --- | --- |
| bucket_id | <code>string</code> | ID (key) of the bucket to be edited in USER_BUDGET. |

<a name="BucketBudget.module_updateIncomeFilters_new"></a>

## updateIncomeFilters()
Updates the income filter select option.

<a name="BucketBudget.module_validateIncomeFilterInputs_new"></a>

## validateIncomeFilterInputs()
Run when add filter or submit changes for income filter button is pressed.
Validates income filter inputs before adding or editing filter.


| Param | Type | Description |
| --- | --- | --- |
| add_or_edit | <code>boolean</code> | True if adding filter, false if editing. |

<a name="BucketBudget.module_addIncomeFilter_new"></a>

## addIncomeFilter()
Runs when add filter button is pressed after inputs are validated.
Takes the name of the filter, buckets, and percentages and adds an income filter to USER_BUDGET.


| Param | Type | Description |
| --- | --- | --- |
| filter_name | <code>string</code> | The name of the IncomeFilter. |
| bucket_ids | <code>Array.&lt;string&gt;</code> | The ID of each Bucket that the income will go into. |
| percentages | <code>Array.&lt;number&gt;</code> | The percentages of income to go into each bucket rounded to 2 decimal places. |
| rounding_bucket | <code>string</code> | The ID of the bucket that will be affected by any (+ or -) rounding errors. |

<a name="BucketBudget.module_removeIncomeFilter_new"></a>

## removeIncomeFilter()
Runs when a remove filter button in the HTML income filter table is pressed.
Removes the selected income filter from USER_BUDGET.

<a name="BucketBudget.module_editIncomeFilter_new"></a>

## editIncomeFilter()
Runs when the edit filter button in the HTML income filter table is pressed.
Enables editing the selected income filter using the income filter table.


| Param | Type | Description |
| --- | --- | --- |
| edit_button | <code>Object</code> | The edit button that was pressed. |

<a name="BucketBudget.module_confirmIncomeFilterEdit_new"></a>

## confirmIncomeFilterEdit()
Runs when a submit changes button in the HTML income filter table is pressed after validating input.
Attempts to make the changes to the income filter in USER_BUDGET if they are valid.


| Param | Type | Description |
| --- | --- | --- |
| filter_id | <code>string</code> | The filter ID (key) of the filter to edit. |
| new_filter_name | <code>string</code> | The name of the IncomeFilter. |
| bucket_ids | <code>Array.&lt;string&gt;</code> | The ID of each Bucket that the income will go into. |
| percentages | <code>Array.&lt;number&gt;</code> | The percentages of income to go into each bucket rounded to 2 decimal places. |
| rounding_bucket | <code>string</code> | The ID of the bucket that will be affected by any (+ or -) rounding errors. |

<a name="BucketBudget.module_incomeFilterCheck_new"></a>

## incomeFilterCheck()
Does input validation and amount calculations for input filters before preview or use.


| Param | Type | Description |
| --- | --- | --- |
| preview_or_use | <code>boolean</code> | True if previewing filter, false if using filter. |

<a name="BucketBudget.module_previewIncomeFilter_new"></a>

## previewIncomeFilter()
Uses selected filter and income to preview amount of money going into each bucket.


| Param | Type | Description |
| --- | --- | --- |
| bucket_ids | <code>Array.&lt;string&gt;</code> | Array of bucket IDs to use with the filter. |
| amounts | <code>Array.&lt;Number&gt;</code> | Monetary amounts for each bucket. |

<a name="BucketBudget.module_useIncomeFilter_new"></a>

## useIncomeFilter()
Uses selected filter and income to add money into the filter's buckets.


| Param | Type | Description |
| --- | --- | --- |
| bucket_ids | <code>Array.&lt;string&gt;</code> | Array of bucket IDs to use with the filter. |
| amounts | <code>Array.&lt;Number&gt;</code> | Monetary amounts for each bucket. |
| transaction_date | <code>string</code> | Date the filter transactions occurred in YYYY-MM-DD format. |
| filter_id | <code>string</code> | ID (key) of the filter being used from USER_BUDGET. |

<a name="BucketBudget.module_addBucketToFilter_new"></a>

## addBucketToFilter()
Adds new bucket input row to income filter.


| Param | Type | Description |
| --- | --- | --- |
| new_bucket_button | <code>Object</code> | The button that was pressed |

<a name="BucketBudget.module_updateLedgerTable_new"></a>

## updateLedgerTable()
Updates the HTML ledger table with the data in USER_BUDGET.
If a bucket no longer exists, a transaction will display the bucket ID.

<a name="BucketBudget.module_sortLedgerTable_new"></a>

## sortLedgerTable()
Run when a column header button on the HTML ledger table is pressed.
Sorts the ledger by the chosen field.
Ascending/descending alternates if the same button is pressed multiple times.


| Param | Type | Description |
| --- | --- | --- |
| field | <code>string</code> | The field to sort by, decided by the sort button. |
| asc | <code>boolean</code> | True if comparison is ascending, false otherwise, decided by the sort button. |
| sort_button | <code>Object</code> | The sort button pressed. |

<a name="BucketBudget.module_setLedgerPage_new"></a>

## setLedgerPage()
Sets the current displayed ledger page based on the parameter given.


| Param | Type | Description |
| --- | --- | --- |
| page_select | <code>number</code> | 0 for first page, 1 for previous page, 2 for next page, 3 for last page. |

<a name="BucketBudget.module_setLedgerPageSize_new"></a>

## setLedgerPageSize()
Sets the number of transactions displayed on one ledger page.


| Param | Type | Description |
| --- | --- | --- |
| take_input | <code>boolean</code> | True is using user input, false if maxing page size. |

<a name="BucketBudget.module_addTransaction_new"></a>

## addTransaction()
Run when add transaction button is pressed.
Takes values from the add new transaction section to add a new transaction to USER_BUDGET.

<a name="BucketBudget.module_removeTransaction_new"></a>

## removeTransaction()
Run when a remove button on the HTML ledger table is pressed.
Removes the corresponding transaction from USER_BUDGET.


| Param | Type | Description |
| --- | --- | --- |
| transaction_id | <code>string</code> | ID (key) of the transaction being removed from USER_BUDGET. |

<a name="BucketBudget.module_editTransaction_new"></a>

## editTransaction()
Runs when an edit button in the HTML ledger table is pressed.
Sets elements in ledger table to edit the transaction.


| Param | Type | Description |
| --- | --- | --- |
| transaction_id | <code>string</code> | ID (key) of the transaction to be edited. |
| edit_button | <code>Object</code> | The edit button that was pressed. |

<a name="BucketBudget.module_cancelTransactionEdit_new"></a>

## cancelTransactionEdit()
Runs when an cancel button in the HTML ledger table is pressed.
Returns the row of the table to displaying the original transaction fields.


| Param | Type | Description |
| --- | --- | --- |
| transaction_id | <code>string</code> | ID (key) of the transaction being edited. |
| cancel_button | <code>Object</code> | The cancel button that was pressed. |

<a name="BucketBudget.module_confirmBucketEdit_new"></a>

## confirmBucketEdit()
Runs when submit changes button in the HTML ledger table is pressed.
Takes the new values for the transaction and changes it in USER_BUDGET if the field values are valid.


| Param | Type | Description |
| --- | --- | --- |
| transaction_id | <code>string</code> | ID (key) of the transaction to be edited in USER_BUDGET. |

