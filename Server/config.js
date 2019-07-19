module.exports = {
    server_host: "192.168.3.254",
    server_port: 80,
    route_list: [
        {path:"/m0",    file:"../Routes/m0"},
        {path:"/m1",    file:"../Routes/m1"},
        {path:"/m2",    file:"../Routes/m2"},
        {path:"/m3",    file:"../Routes/m3"},
        {path:"/m4",    file:"../Routes/m4"},
        {path:"/m5",    file:"../Routes/m5"},
        {path:"/m6",    file:"../Routes/m6"},
        {path:"/m7",    file:"../Routes/m7"},
        {path:"/m8",    file:"../Routes/m8"},
        {path:"/m9",    file:"../Routes/m9"},
        {path:"/m10",   file:"../Routes/m10"},
        {path:"/m11",   file:"../Routes/m11"},
        {path:"/m12",   file:"../Routes/m12"},
        {path:"/m13",   file:"../Routes/m13"},
        {path:"/m14",   file:"../Routes/m14"},
        {path:"/m15",   file:"../Routes/m15"},
        {path:"/m16",   file:"../Routes/m16"},
        {path:"/m17",   file:"../Routes/m17"},
        {path:"/m18",   file:"../Routes/m18"},
        {path:"/m19",   file:"../Routes/m19"}
    ],
    db_info: {
        connectionLimit:1,
        host:"gdj16.gudi.kr",
        user:"m0",
        password:"m0",
        database:"hole",
        port: 53306,
        debug:false
    },
    server_error: {
        static: {
          "404":"./error/404.html"
        }
    }
}