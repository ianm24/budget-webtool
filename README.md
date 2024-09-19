# budget-webtool
This is a simple bucket budget with a ledger and income filters for keeping track of transactions.

Full documentation for the code is generated using [JSDoc](https://jsdoc.app/) comments and [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown)

# How to run
After cloning or downloading the repo, open `index.html` in a browser.
From there you have access to the budget application.

# Features
[Data Operations](#data-operations)
- [Importing Data](#importing-data)
- [Exporting Data](#exporting-data)

[Buckets](#buckets)
- [Adding a New Bucket](#adding-a-new-bucket)
- [The Bucket Table](#the-bucket-table)
- [Editing a Bucket](#editing-a-bucket)
- [Removing a Bucket](#removing-a-bucket)

[Income Filters](#income-filters)
- [Adding a New Income Filter](#adding-a-new-income-filter)
- [Resetting the Income Filter Table](#resetting-the-income-filter-table)
- [Previewing an Income Filter](#previewing-an-income-filter)
- [Using an Income Filter](#using-an-income-filter)
- [Editing an Income Filter](#editing-an-income-filter)
- [Removing an Income Filter](#removing-an-income-filter)

[Ledger](#ledger)
- [Adding a New Transaction](#adding-a-new-transaction)
- [Ledger Pagination](#ledger-pagination)
- [Sort the Ledger by Field](#sort-the-ledger-by-field)
- [Editing a Transaction](#editing-a-transaction)
- [Removing a Transaction](#removing-a-transaction)

## Data Operations

### Importing Data
Currently the only supported data type for importing is JSON formatted in the way the exporter uses.
<details>

<summary>Example JSON data file:</summary>
<pre>
<code>
{
  "buckets": {
    "bucket_1": {
      "display_name": "Bucket 1",
      "value": 0.33
    },
    "bucket_2": {
      "display_name": "Bucket 2",
      "value": -0.33
    }
  },
  "income_filters": {
    "filter_1": {
      "display_name": "Filter 1",
      "bucket_percentages": {
        "bucket_1": 90.51,
        "bucket_2": 9.49
      },
      "rounding_bucket": "bucket_2"
    }
  },
  "ledger": {
    "transactions": {
      "_1": {
        "id": 1,
        "date": "2024-01-01",
        "bucket": "bucket_2",
        "description": "Transaction 2",
        "value": -0.33,
        "bucket_before": 0,
        "bucket_after": -0.33
      },
      "_0": {
        "id": 0,
        "date": "2024-01-01",
        "bucket": "bucket_1",
        "description": "Transaction 1",
        "value": 0.33,
        "bucket_before": 0,
        "bucket_after": 0.33
      }
    },
    "id_counter": 2,
    "sort_field": "date",
    "sort_dir_asc": false
  },
  "page": 0,
  "page_size": 25
}
</code>
</pre>
</details>
<br/>

To import data, click on the `Browse...` button to open a file dialog and choose the JSON file to import.
Then click the `Import File` button.
<br/>

If there are any issues with the formatting of the JSON, you will get an alert telling you so.
In that case, the data will still import as best as possible, but some elements may be incorrect.

### Exporting Data
Currently you can only export budget data to a JSON file. This file can be imported to continue working on the budget.
Exporting data includes all bucket, income filter, transaction, ledger sorting, and ledger page data.
<br/>

To export data, click on the `Export to JSON` button.
This will download a `budget.json` file to your browser's default download location.

## Buckets
Buckets are categories used to assign money for a specific purpose.
Some examples of buckets are: Rent and Utilities, Savings, Groceries, Travel, and Mutual Aid.

### Adding a New Bucket
Bucket names must be different enough from each other so that when all letters are lowercase and spaces are replaced with underscores (`_`), no two buckets are identical.
<br/>

To add a bucket, enter a name into the `Bucket Name` text field and click the `Add Bucket` button.
Buckets start with a value of 0 and that value is only modified by transactions.
<br/>

### The Bucket Table
The bucket table shows each bucket's name and value. It also gives `Edit` and `Remove` buttons for each bucket.

### Editing a Bucket
Bucket name changes have the same constraints as when adding a new bucket.
<br/>

After editing a bucket's name, it will be updated in the bucket table, any transactions associated with the bucket, and in any income filters using the bucket.
A transaction will also be added to the ledger indicating a bucket's name change.
<br/>

To edit a bucket's name, click the `Edit` button in that row of the bucket table.
To confirm the bucket name change, click on the `Submit Changes` button.
To cancel the bucket name change, click on the `Cancel` button.

### Removing a Bucket
Removing a bucket will take it off of the bucket table.
Transactions associated with the bucket will now show the bucket ID rather than the display name and cannot be edited.
Income filters using the removed bucket will not be useable until they have been updated to use available buckets.
<br/>

To remove a bucket, click the `Remove` button in that row of the bucket table.

## Income Filters
Income filters allow you to set how much of your income goes into each bucket.

### Adding a New Income Filter
Income filters follow the same naming rules as buckets.
You may only use a specific bucket once per income filter.
The percentages for an income filter must add to `100.00`.
While you can specify a percentage with more than 2 decimal places, it will be rounded to 2 decimal places.
Depending on percentages chosen, there will occasionally be rounding errors of a couple cents, so you will choose which bucket is affected by these rounding errors.
<br/>

To add an income filter, first put the name of it in the `Filter Name` text field.
To set how much money goes into a bucket, click the `Select a bucket` drop down and choose a bucket.
Then enter what percent of your income should go into that bucket in the `% of income` number field.
To add more buckets to the filter, click the `Add Bucket to Filter` button.
To remove a bucket from the filter, click the `Remove Bucket from Filter` button in that row of the income filter table.
To choose which bucket will be affected by rounding errors, click the radio button in the "Round?" column for that bucket.
To finish adding the income filter, click the "Add Filter" button.

### Resetting the Income Filter Table
Resetting the income filter table will return it to a state where you can add a new filter with all fields blank.
<br/>

If at any point you wish to reset the filter table, click the `Reset Table` button.

### Previewing an Income Filter
The income value for previewing an income filter must be at least `0.01`.
<br/>

Previewing an income filter will cause the income filter table to show each bucket used in the filter and the specific amount each bucket would get for a given income value..
<br/>

To preview an income filter, first click the `Select a filter` dropdown and choose a filter to preview.
Then enter the income value to use with the filter.
To bring up the preview, click the `Preview Filter` button.

### Using an Income Filter
The income value for using an income filter must be at least `0.01`.
<br/>

Using an income filter will add transactions to the ledger for each bucket that is in the filter of an amount based on the income value and the set percentages for each bucket.
The description of the transactions will be the name of the filter, and the date will be what you choose when using the filter.
<br/>

To use an income filter, first click the `Select a filter` dropdown and choose a filter to use.
Next enter the income value to use with the filter.
Next select a date that the income transactions will be set to.
To use the income filter and add transactions to the ledger, click the `Use Filter` button.

### Editing an Income Filter
The restrictions on editing an income filter are the same as when adding one.
<br/>

Editing the income filter allows you to edit the filter in the same way as when you added it.
<br/>

To edit an income filter, first click the `Select a filter` dropdown and choose a filter to edit.
To start the editing process, click the `Edit Filter` button.
You may now edit the filter as you wish.
To confirm changes to the filter, click the `Submit Changes` button.
To cancel the edit, click the `Cancel Edit` button.

### Removing an Income Filter
Removing an income filter gets rid of it but does not affect anything else in the budget.
<br/>

To remove an income filter, first click the `Select a filter` dropdown and choose a filter to remove.
To confirm the removal, click the `Remove Filter` button.

## Ledger
The ledger stores all of the transactions in the budget.
It displays the date, bucket, description, value, bucket value before transaction, and bucket value after transaction for each transaction.

### Adding a New Transaction
There must be a description for each transaction.
Transaction descriptions are limited to 128 characters.
While you can specify a transaction value with more than 2 decimal places, it will be rounded to 2 decimal places.
The transaction value should be positive for income and negative for expenses.
<br/>

Adding a new transaction will update the value of the bucket value associated with it.
If the transaction has a date older than the most recent transaction in its bucket, all transactions after the one added will have their bucket before and after values updated.
<br/>

To add a new transaction, first select the date the transaction occurred on.
Next click the `Select a bucket` dropdown and choose the bucket the transaction belongs to.
Next type in a description of the transaction in the `Describe the transaction` text field.
Next enter the value of the transaction in the `Value (+ or -)` number field.
To add the transaction to the ledger, click the `Add Transaction` button.

### Ledger Pagination
The ledger is displayed in pages.
By default, each page displays up to 25 transactions.
Page sizes must be whole numbers.
When the page size is changed, the current page is changed so that some of the transactions you saw before changing the size are still visible.
<br/>

The page you are currently on is displayed between the `<` and `>` buttons
To navigate between pages in the ledger use the following buttons:
- To go to the first page of the ledger, click the `<<` button.
- To go to the previous page of the ledger, click the `<` button.
- To go to the next page of the ledger, click the `>` button.
- To go to the last page of the ledger, click the `>>` button.

To change the amount of transactions displayed on a page (page size), enter the new size into the `Page Size` number field.
To confirm the change, click the `Set Page Size` button.
<br/>

If you wish to have all transactions in the ledger display on 1 page, click the `Set 1 Page` button.

### Sort the Ledger by Field
The ledger can be sorted by the date, bucket, and value fields.
A `^` on a field indicates the ledger is sorted by that field in ascending order.
A `v` on a field indicates the ledger is sorted by that field in descending order.
For buckets, alphabetical is ascending and reverse alphabetical is descending.
<br/>

To sort the ledger by a field, click the field button in the first row of the ledger table.
This will sort the ledger by that field in ascending order.
To sort the ledger by that same field but in descending order, click the field button again.

### Editing a Transaction
The restrictions on editing a transaction are the same as when adding one.
<br/>

Editing a transaction will update all transactions and buckets affected by it.
If a transaction is associated with a removed bucket, it will not be editable.
<br/>

To edit a transaction, first click the `Edit` button in the transaction's row in the ledger table.
You may edit the date, bucket, description, and value of the transaction.
To confirm changes to the filter, click the `Submit Changes` button.
To cancel the edit, click the `Cancel` button.

### Removing a Transaction
Removing a transaction gets rid of it and updates any transactions after it and the value of the bucket it was in.
<br/>

To remove a transaction, go to its row in the ledger table and click the remove button.