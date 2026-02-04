async function LoadData() {
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();
    let body = document.getElementById("body_table");
    body.innerHTML = '';

    for (const post of posts) {

        // nếu xoá mềm thì gạch ngang
        let rowClass = post.isDeleted ? "deleted" : "";

        body.innerHTML += `<tr class="${rowClass}">
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.views}</td>
            <td>
                ${post.isDeleted
                ? `<span>Deleted</span>`
                : `<input type="submit" value="Delete" onclick="Delete(${post.id})"/>`
            }
            </td>
        </tr>`;
    }
}

async function getNextPostId() {
    let res = await fetch("http://localhost:3000/posts");
    let posts = await res.json();

    if (posts.length === 0) return "1";

    let maxId = Math.max(...posts.map(c => Number(c.id)));
    return (maxId + 1).toString();
}


async function Save() {
    let id = document.getElementById("id_txt").value;
    let idNext = await getNextPostId();
    let title = document.getElementById("title_txt").value;
    let views = document.getElementById("view_txt").value;
    let getItem = await fetch('http://localhost:3000/posts/' + id)
    if (getItem.ok && id) {
        let res = await fetch('http://localhost:3000/posts/' + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                views: views
            })
        });
        if (res.ok) {
            console.log("Thanh cong");
        }
    } else {
        try {
            let res = await fetch('http://localhost:3000/posts', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: idNext,
                    title: title,
                    views: views
                })
            });
            if (res.ok) {
                console.log("Thanh cong");
            }
        } catch (error) {
            console.log(error);
        }
    }
    LoadData();
    return false;



}
async function Delete(id) {
    let res = await fetch("http://localhost:3000/posts/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isDeleted: true
        })
    });

    if (res.ok) {
        console.log("Xoá mềm thành công");
    }

    LoadData();
}


LoadData();

async function LoadComment() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();
    let body = document.getElementById("comment_section");
    body.innerHTML = '';
    console.log(comments);
    for (const comment of comments) {

        // nếu xoá mềm thì gạch ngang
        let rowClass = comment.isDeleted ? "deleted" : "";

        body.innerHTML += `<tr class="${rowClass}">
            <td>${comment.id}</td>
            <td>${comment.text}</td>
            <td>${comment.postId}</td>
            <td>
                ${comment.isDeleted
                ? `<span>Deleted</span>`
                : `<input type="submit" value="Delete" onclick="deleteComment(${comment.id})"/>`
            }
            </td>
        </tr>`;
    }
}

async function checkPostExists(postId) {
    let res = await fetch("http://localhost:3000/posts/" + postId);
    let resJson = await res.json();
    if (resJson.isDeleted) return false;
    return res.ok;
}

async function getNextCommentId() {
    let res = await fetch("http://localhost:3000/comments");
    let comments = await res.json();

    if (comments.length === 0) return "1";

    let maxId = Math.max(...comments.map(c => Number(c.id)));
    return (maxId + 1).toString();
}

async function SaveComment() {
    let commentId = document.getElementById("comment_id").value;   // rỗng khi tạo mới
    let text = document.getElementById("comment_text").value;
    let postId = document.getElementById("comment_postId").value;

    if (!postId) {
        alert("Vui lòng nhập Post ID");
        return;
    }


    let postExists = await checkPostExists(postId);
    if (!postExists) {
        alert("Post không tồn tại ❌");
        return;
    }

    if (commentId) {
        let getItem = await fetch("http://localhost:3000/comments/" + commentId);

        // UPDATE
        if (getItem.ok) {
            let res = await fetch("http://localhost:3000/comments/" + commentId, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text,
                    postId: postId
                })
            });

            if (res.ok) {
                console.log("Update comment thành công");
            }
            return;
        }
    }

    // CREATE (không có id hoặc id không tồn tại)
    let newId = await getNextCommentId();

    let res = await fetch("http://localhost:3000/comments", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: newId,
            text: text,
            postId: postId
        })
    });

    if (res.ok) {
        console.log("Tạo comment thành công");
    }
}
async function deleteComment(id) {
    let res = await fetch("http://localhost:3000/comments/" + id, {
        method: "DELETE"
    });

    if (res.ok) {
        console.log("Xoá comment thành công");
    }
}

LoadComment();