//ADD SEPERATE ARRAY INTO DATABASE FOR USERS AND FOR MEALS

var database = {
    users: [{
            id: 1,
            firstName: "John",
            lastName: "Evans",
            street: "Lovendijkstraat 61",
            city: "Breda",
            isActive: true,
            emailAddress: "j.evans@server.com",
            phoneNumber: "061-242-5475"
        },
        {
            id: 2,
            firstName: "Gijs",
            lastName: "Ernst",
            street: "Sacrementsstraat 1",
            city: "Leeuwarden",
            isActive: false,
            emailAddress: "g.ernst@server.com",
            phoneNumber: "062-948-1919"
        },
        {
            id: 3,
            firstName: "Elliot",
            lastName: "Garm",
            street: "Hogeschoollaan 32",
            city: "Breda",
            isActive: true,
            emailAddress: "e.garm@server.com",
            phoneNumber: "062-929-1919"
        },
        {
            id: 4,
            firstName: "Davy",
            lastName: "Crocker",
            street: "New York Street 12",
            city: "Breda",
            isActive: false,
            emailAddress: "d.crocker@server.com",
            phoneNumber: "062-948-1123"
        },
        {
            id: 5,
            firstName: "Willem",
            lastName: "Poro",
            street: "Leeuwardenstraat 19",
            city: "Leeuwarden",
            isActive: true,
            emailAddress: "w.poro@server.com",
            phoneNumber: "062-900-1919"
        }
    ]
};

module.exports = database;