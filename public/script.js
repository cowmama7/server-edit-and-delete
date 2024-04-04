let activeCraft;


const showCrafts = async () => {
  let craftJSON = await getJSON();
  if (craftJSON == null) return;

  let craftDiv = document.getElementById("craft-list");
  craftDiv.innerHTML = document.getElementById("craft-list2").innerHTML;
  for (let i = 0; i < craftJSON.length; i++) {
    let columnDiv = document.getElementById("clm" + (i % 4));
    let section = document.createElement("section");
    columnDiv.append(section);
    let title = craftJSON[i].name;
    section.className = "craftImg"
    section.id = i;
    let craftImg = document.createElement("img")
    section.append(craftImg);
    craftImg.src = "./images/"+craftJSON[i].img;
  }


  let imgClick = document.getElementsByClassName("craftImg");
  for (const element of imgClick) {
    element.addEventListener("click", e => {
      document.getElementById('id01').style.display = 'block'
      let f = element.id;
      activeCraft=craftJSON[f];
      document.getElementById("title").textContent = craftJSON[f].name;
      document.getElementById("description").textContent = craftJSON[f].description;
      document.getElementById("popupImage").src = "./images/"+craftJSON[f].img;
      listDiv.innerHTML = "";
      for (let i = 0; i < craftJSON[f].supplies.length; i++) {
        let k = document.createElement("li")
        k.textContent = craftJSON[f].supplies[i];
        document.getElementById("listDiv").appendChild(k);
      }
    })
  }
}

const getJSON = async () => {
  try {
    return (await fetch("api/crafts/")).json();
  } catch (error) {
    console.log("error retrieving JSON");
    return null;
  }
};

const resetForm = () => {
  const form = document.getElementById("add-craft-form");
  form.reset();
  document.getElementById("supply-boxes").innerHTML = "";
  document.getElementById("img-prev").src = "";
};


const showCraftForm = (e) => {
  e.preventDefault();
  openDialog("add-craft-form");
  resetForm();
};

const openDialog = (id) => {
  document.getElementById("dialog").style.display = "block";
  document.querySelectorAll("#dialog-details > *").forEach((item) => {
    item.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
};



const addSupply = (e) => {
  e.preventDefault();
  const section = document.getElementById("supply-boxes");
  const input = document.createElement("input");
  input.type = "text";
  section.append(input);
};

const addEditCraft = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-craft-form");
  const formData = new FormData(form);
  let response;
  formData.append("supplies", getSupplies());

  console.log(...formData);

 if (form._id.value.trim() == "") {
    console.log("in post");
    response = await fetch("/api/crafts", {
      method: "POST",
      body: formData,
    });
  } else {
    //put request
    console.log("in put");
    response = await fetch(`/api/crafts/${form._id.value}`, {
      method: "PUT",
      body: formData
    });
  }

  console.log(response);
  //successfully got data from server
  if (response.status != 200) {
    console.log("Error posting data");
  }

  await response.json();
  resetForm();
  document.getElementById("dialog").style.display = "none";
  showCrafts();
};

const getSupplies = () => {
  const inputs = document.querySelectorAll("#supply-boxes input");
  let supplies = [];

  inputs.forEach((input) => {
    supplies.push(input.value);
  });

  return supplies;
};

//---------------------------

const populateEditForm = (craft) => {
  const form = document.getElementById("add-craft-form");
  form._id.value = craft._id;
  form.name.value = craft.name;
  form.description.value = craft.description;
  document.getElementById("img-prev").src = "./images/"+craft.img;
  //add supplies
  populateSupplies(craft.supplies);
};

const populateSupplies = (supplies) => {
  const section = document.getElementById("supply-boxes");
  supplies.forEach((supply) => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = supply;
    section.append(input);
  });
};

const deleteCraft = async (craft) => {
  let response = await fetch(`/api/crafts/${craft._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (response.status != 200) {
    console.log("Error deleting");
    return;
  }

  let result = await response.json();
  resetForm();
  showCrafts();
  document.getElementById("dialog").style.display = "none";
};

//---------------------------

const deleteFunction = () => {
  console.log(activeCraft.name);
  deleteCraft(activeCraft);
  activeCraft=null;
  document.getElementById("id01").style.display="none";
}

const editFunction = () => {
  console.log(activeCraft._id);
  document.getElementById("id01").style.display="none";
  openDialog("add-craft-form");
  resetForm();
  document.getElementById("dialog").style.display="block";
  populateEditForm(activeCraft);
}


window.onload = () => {
  showCrafts();
  document.getElementById("add-craft-form").onsubmit = addEditCraft;
  document.getElementById("add-link").onclick = showCraftForm;
  document.getElementById("add-supply").onclick = addSupply;
  document.getElementById("deleteLink").onclick = deleteFunction;
  document.getElementById("editLink").onclick = editFunction;
}

document.getElementById("img").onchange = (e) => {
  if (!e.target.files.length) {
    document.getElementById("img-prev").src = "";
    return;
  }
  document.getElementById("img-prev").src = URL.createObjectURL(
    e.target.files.item(0)
  );
};