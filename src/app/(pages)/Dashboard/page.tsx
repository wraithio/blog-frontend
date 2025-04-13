"use client";
import { addBlogItem, checkToken, deleteBlogItem, getBlogItemsByUserId, getLoggedInUserData, getToken, loggedInData, updateBlogItem } from "@/utils/DataServices";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  FileInput,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  ListGroup,
} from "flowbite-react";
import { IBlogItems } from "@/utils/Interfaces";
import BlogEntries from "@/utils/BlogEntries.json"
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const page = () => {
  // console.log(loggedInData());
  const [openModal, setOpenModal] = useState<boolean>(false);
  // these use states will be for our form
  const [blogTitle, setBlogTitle] = useState<string>("");
  const [blogImage, setBlogImage] = useState<any>("");
  const [blogDescription, setBlogDescription] = useState<string>("");
  const [blogCategory, setBlogCategory] = useState<string>("");
  const [blogId, setBlogId] = useState<number>(0);
  const [userId, setUserId] = useState<number>(0);
  const [blogPublisherName, setBlogPublisherName] = useState<string>("");

  const [edit, setEdit] = useState<boolean>(false);

  const [blogItem, setBlogItems] = useState<IBlogItems[]>(BlogEntries);
  const router = useRouter();

  useEffect(() => {

    const getLoggedInData = async() => {
      // get the user's information
      const loggedIn = loggedInData()
      setBlogId(loggedIn.id)
      setBlogPublisherName(loggedIn.username)
      // get the user's blog items
      const userBlogItems = await getBlogItemsByUserId(loggedIn.id, getToken())
      console.log(userBlogItems)
      
      // set user's blog items inside of our website
      setBlogItems(userBlogItems)
    }


    if (!checkToken) {
      //push to login page
      router.push('/')
    } else {
      //get UserData/Login Login function
      getLoggedInData();
    }
  }, []);

  // FORM FUNCTIONS ------------------------------

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBlogTitle(e.target.value);

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) =>
    setBlogDescription(e.target.value);

  const handleCategory = (categories: string) => setBlogCategory(categories);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let reader = new FileReader()
    let file = e.target.files?.[0]

    if (file) {
      //when this files if turned into a string this on load function will run
      reader.onload = () => { 
        setBlogImage(reader.result) //once the file is read we will store the result into our setter function
      }
      reader.readAsDataURL(file); //this converts the file into a bas64-encoded string
    }


  };


  // ACCORDION FUNCTIONS -------------------------

  const handleShow = () => {
    setOpenModal(true);
    setEdit(false);
    setBlogId(0)
    setUserId(userId)
    setBlogPublisherName(blogPublisherName)
    setBlogTitle("")
    setBlogImage("")
    setBlogDescription("")
    setBlogCategory("")
  };

  const handleEdit = (items: IBlogItems) => {
    setOpenModal(true);
    setEdit(true);
    setBlogId(items.id)
    setUserId(items.userId)
    setBlogPublisherName(items.publisherName)
    setBlogTitle(items.title)
    setBlogImage(items.image)
    setBlogDescription(items.description)
    setBlogCategory(items.category)
  };

  const handlePublish = async (items: IBlogItems) => {
    items.isPublished = !items.isPublished;
    let result = await updateBlogItem(items, getToken())

    if(result) {
      let userBlogItems = await getBlogItemsByUserId(userId, getToken())
      setBlogItems(userBlogItems)
    }else{
      alert("Blog was not published...")
    }
  };

  const handleDelete = async (items: IBlogItems) => {
    items.isDeleted = true;

    let result = await deleteBlogItem(items, getToken())

    if(result){
      let userBlogItems = await getBlogItemsByUserId(userId, getToken())
      setBlogItems(userBlogItems)
    }else{
      alert("Blog was not deleted...")
    }
  };

  // SAVE FUNCTION ---------------------------------
  const handleSave = async(e: React.MouseEvent<HTMLButtonElement>) => {
    const item: IBlogItems = {
      id: blogId,
      userId: userId,
      publisherName: blogPublisherName,
      title: blogTitle,
      image: blogImage,
      description: blogDescription,
      date: format(new Date(), "MM-dd-yyyy"),
      category: blogCategory,
      isPublished: e.currentTarget.textContent === "Save" ? false : true,
      isDeleted: false
    };
    setOpenModal(false);

    let result = false;
    if (edit) {
      // edit logic here
      result = await updateBlogItem(item, getToken())
    } else {
      // add logic here
      result = await addBlogItem(item, getToken())
    }

    if(result) {
      let userBlogItems = await getBlogItemsByUserId(userId, getToken())
      setBlogItems(userBlogItems)
    }else {
      alert(`Blog was not ${edit ? "updated" : "added"}...`)
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="flex flex-col items-center mb-10">
        <h1 className="text-center text-3xl">DashBoard Page</h1>
        <Button onClick={() => setOpenModal(true)}>Add Blog</Button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <ModalHeader>{edit ? "Edit Blog Post" : "Add Blog Post"}</ModalHeader>
          <ModalBody>
            <form className="flex max-w-md flex-col gap-4">
              <div>
                <div className="mb-2 block">
                  {/* Title, Image, Description Category, Tags */}
                  <Label htmlFor="Title">Title</Label>
                </div>
                <TextInput
                  id="Title"
                  type="text"
                  placeholder="Title"
                  required
                  onChange={handleTitle}
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="descrption">Description</Label>
                </div>
                <TextInput
                  id="Description"
                  placeholder="Description"
                  type="text"
                  required
                  onChange={handleDescription}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Dropdown label="Categories" dismissOnClick={true}>
                    <DropdownItem onClick={() => handleCategory("Jiu Jitsu")}>
                      Jiu Jitsu
                    </DropdownItem>
                    <DropdownItem onClick={() => handleCategory("Boxing")}>
                      Boxing
                    </DropdownItem>
                    <DropdownItem onClick={() => handleCategory("Kung Fu")}>
                      Kung Fu
                    </DropdownItem>
                  </Dropdown>
                </div>
                <div className="mb-2 block">
                  <Label htmlFor="Image">Image</Label>
                </div>
                <FileInput
                  onChange={handleImage}
                  id="Picture"
                  accept="image/png, image/jpg"
                  placeholder="Chose Picture"
                />
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave}>Save and publish</Button>
            <Button onClick={handleSave}>Save</Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Accordion alwaysOpen className="w-3xl mt-5">
          <AccordionPanel>
            <AccordionTitle>Published Blog Items</AccordionTitle>
            <AccordionContent>
              <ListGroup>
                {
                  blogItem.map((item:IBlogItems,idx:number) => {
                    return(
                      <div key={idx}>
                        {
                          item.isPublished && !item.isDeleted && (
                            <div className="flex flex-col gap-2 p-10">
                              <h2 className="text-3xl">{item.title}</h2>
                              <div className="flex flex-row space-x-3">
                                <Button color="blue" onClick={() => handleEdit(item)}>Edit</Button>
                                <Button color="red" onClick={() => handleDelete(item)}>Delete</Button>
                                <Button color="yellow" onClick={() => handlePublish(item)}>Unpublish</Button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  })
                }
              </ListGroup>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel>
            <AccordionTitle>Unpublished Blog Items</AccordionTitle>
            <AccordionContent>
            <ListGroup>
                {
                  blogItem.map((item:IBlogItems,idx:number) => {
                    return(
                      <div key={idx}>
                        {
                          !item.isPublished && !item.isDeleted && (
                            <div className="flex flex-col gap-2 p-10">
                              <h2 className="text-3xl">{item.title}</h2>
                              <div className="flex flex-row space-x-3">
                                <Button color="blue" onClick={() => handleEdit(item)}>Edit</Button>
                                <Button color="red" onClick={() => handleDelete(item)}>Delete</Button>
                                <Button color="yellow" onClick={() => handlePublish(item)}>Publish</Button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  })
                }
              </ListGroup>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </main>
  );
};

export default page;
