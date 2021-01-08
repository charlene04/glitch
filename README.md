An API that reads .csv file and returns queried data.

#Request body
{
  "csv":{
    "url": "https://linktocsv",
    "select_fields": ["First Name", "Last Name", "Age"],
  }
}

#Response

{
  "conversion_key": "ZEMAHBb54vkFXPHA9jHY6Xp3gMnMAKYg",
  "json": [
    {
      "First Name":"Ade",
      "Last Name":"Stark",
      "Age": 21 
    },
    {
      "First Name":"Ade",
      "Last Name":"Stark",
      "Age": 21 
    }
  ]
}