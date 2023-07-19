const api = require("./famark-cloud");
const promptSync = require("prompt-sync");
const prompt = promptSync();

async function main() {
    //Assigning Credentials
    const domainName = prompt("Enter Domain Name: ");
    const userName = prompt("Enter UserName: ");
    const password = prompt("Enter Password: ");

    const sessionId = await getSessionId(domainName, userName, password);

    if (sessionId == null) {
        console.log("Login Failed!");
        return;
    }

    let ans = prompt("Do you want to create a new record? (Y or N): ");
    while (ans == "Y" || ans == "y") {
        const firstName = prompt("Enter First Name: ");
        const lastName = prompt("Enter Last Name: ");
        const phone = prompt("Enter Phone: ");
        const email = prompt("Enter Email: ")

        const contactRecord = {
            FirstName: firstName,
            LastName: lastName,
            Phone: phone,
            Email: email
        };

        const businessContactId = await api.postData(
            "/Business_Contact/CreateRecord",
            JSON.stringify(contactRecord),
            sessionId
        );

        console.log("Created RecordId: " + businessContactId);
        ans = prompt("Do you want to create a new record? (Y or N): ");
    }

    //Retrieving Business_Contact records
    const retrieveMultipleQuery = {
        Columns: "FullName, Phone, Email, Business_ContactId",
        OrderBy: "FullName"
    };

    const businessContacts = await api.postData(
        "/Business_Contact/RetrieveMultipleRecords",
        JSON.stringify(retrieveMultipleQuery),
        sessionId
    );

    for (let i = 0; i < businessContacts.length; i++) {
        console.log(businessContacts[i]);
    }

    //Update Contact
    ans = prompt("Do you want to update a record? (Y or N): ");
    if (ans == "Y" || ans == "y") {

        const contactId = prompt("Enter ContactId: ");
        const firstName = prompt("Enter First Name: ");
        const lastName = prompt("Enter Last Name: ");
        const phone = prompt("Enter Phone: ");
        const email = prompt("Enter Email: ")

        const contactRecord = {
            FirstName: firstName,
            LastName: lastName,
            Phone: phone,
            Email: email,
            Business_ContactId: contactId
        };

        const businessContactId = await api.postData(
            "/Business_Contact/UpdateRecord",
            JSON.stringify(contactRecord),
            sessionId
        );

        //Retrieve Single Record (Updated Record by Id)
        if (businessContactId != null) {
            const retrieveRecordQuery = {
                Columns: "FullName, Phone, Email, Business_ContactId",
                Business_ContactId: contactId
            };

            const updatedContact = await api.postData(
                "/Business_Contact/RetrieveRecord",
                JSON.stringify(retrieveRecordQuery),
                sessionId
            );

            console.log("Updated Record:-");
            console.log(updatedContact);
        }
    }

    ans = prompt("Do you want to delete a record? (Y or N): ");
    if (ans == "Y" || ans == "y") {

        const contactId = prompt("Enter ContactId: ");
        const deleteRecordDate = {
            Business_ContactId: contactId
        };

        await api.postData(
            "/Business_Contact/DeleteRecord",
            JSON.stringify(deleteRecordDate),
            sessionId
        );

        console.log("Record Deleted!");
    }
}

async function getSessionId(domainName, userName, password) {
    const credential = {
        DomainName: domainName,
        UserName: userName,
        Password: password,
    };

    return await api.postData(
        "/Credential/Connect",
        JSON.stringify(credential),
        null
    );
}

//calling main method
main();