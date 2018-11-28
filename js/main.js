d3.csv("aircraft_incidents.csv", function(error, data) {
    if (error) throw error;

    var damageType = d3.nest().key(function(d) {
        return d.Aircraft_Damage;
    }).key(function(e) {
        if (e.Broad_Phase_of_Flight === "") {
            return "Unknown";
        }
        return e.Broad_Phase_of_Flight;
    }).key(function(z) {
        if (z.Make === "none") {
            return "No Data";
        }
        return z.Make;
    })
    .key(function(j) {
            if (j.Model === "none") {
                return "No Data";
            }
            return j.Model;
        })
    .key(function(t) {
            if (t.Total_Uninjured === "none") {
                return "No Data";
            }
               switch (t.Total_Fatal) {
                            case 0:
                                return t.Total_Uninjured;
                            default:
                                return t.Total_Fatal;
                        }
            return t.Total_Uninjured;
        }).rollup(function(t) {
        return t.length;
    }).entries(data);

    console.log(damageType)


    damageType = damageType.sort(function(a, b) {
        return d3.sum(b.values, function(c) {
            return d3.sum(c.values, function(d) {
                return d.value;
            });
        }) - d3.sum(a.values, function(c) {
            return d3.sum(c.values, function(d) {
                return d.value;
            });
        });
    });

        console.log(damageType)

    damageType.forEach((Aircraft_Damage) => {
        Aircraft_Damage.values.sort(function(a, b) {
            return d3.sum(b.values, function(t) {
                return t.value;
            }) - d3.sum(a.values, function(t) {
                return t.value;
            });
        });
        Aircraft_Damage.values.forEach((Broad_Phase_of_Flight) => {
            Broad_Phase_of_Flight.values.sort(function(a,b) {
                return b.value - a.value;
            });
        });
    });



damageType = {"key": "Aircraft Damage", "values": damageType};
    damageType = { "name": "Aircraft Damage", "label": "Aircraft Damage", "children":
        damageType.values.map( function(Aircraft_Damage) {
            return { "name":  Aircraft_Damage.key, "label":  Aircraft_Damage.key, "children":
              Aircraft_Damage.values.map( function(Broad_Phase_of_Flight) {
                 return { "name": Broad_Phase_of_Flight.key, "label": Broad_Phase_of_Flight.key, "children":
              Broad_Phase_of_Flight.values.map(function(Make) {
                        return {"name": Make.key, "label": Make.key, "children":
                        Make.values.map(function(Model){
                        return {"name": Model.key, "label": Model.key, "children":
                        Model.values.map(function(Total_Uninjured){
                        return {"name": Total_Uninjured.key, "label": Total_Uninjured.key, "size": Total_Uninjured.value

                   }
                    })
                };
              })
            };
        })
    };
      })
          };
             })
   };

      console.log(damageType)



    var color = d3.scaleOrdinal()
        .domain(["Substantial", "Destroyed", "Minor", "Unknown"])
         .range(["#c2ddad", "#adc9dd", "#efab58", "#ffd026", "#d3baff", "#ed5e5e"]);

    var root = d3.hierarchy(damageType);
    d3ZoomableTreemap('treemap', root, {
        sum_function: function(d) {
                    if (!d.hasOwnProperty('children'))
                        return d.size;
                    else
                        return 0.0;
                },
        height: 840,
        margin_top: 60,
        zoom_out_msg: "- click to zoom out",
        zoom_in_msg: "- click on aircraft damage type",
        fill_color: "#fff",
        color_scale: color,
        format_number: function (number) {
            switch (number) {
                case 1:
                    return number + " incident";
                default:
                    return number + " incidents";
            }
        }
    });

  var listAff = d3.nest().key(function(d) {
        return d.Aircraft_Damage;
    }).rollup(function(e) {
        return {
            "name": e.Broad_Phase_of_Flight,
            "description": e.Total_Uninjured
        };
    }).entries(data);
    console.log(listAff)


        var listAff = d3.nest().key(function(d) {
            return d.Aircraft_Damage;
        }).rollup(function(e) {
            return {
                "Fatal": e.Total_Fatal_Injuries,
                "Total_Uninjured": e.Total_Uninjured
            };
        }).entries(data);









});