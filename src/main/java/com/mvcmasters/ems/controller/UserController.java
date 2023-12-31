package com.mvcmasters.ems.controller;

import com.mvcmasters.ems.base.BaseController;
import com.mvcmasters.ems.base.ResultInfo;
import com.mvcmasters.ems.model.UserModel;
import com.mvcmasters.ems.query.UserQuery;
import com.mvcmasters.ems.service.UserService;
import com.mvcmasters.ems.utils.LoginUserUtil;
import com.mvcmasters.ems.vo.User;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * Controller class responsible for handling user-related operations.
 */
@Controller
// All routes in this controller will be prefixed with "user"
@RequestMapping("/user")
public class UserController extends BaseController {
    /**
     * Service for handling user-related operations.
     */
    @Resource
    private UserService userService;

    /**
     * User login operation.
     * @param userName the name of the user.
     * @param userPwd the password of the user.
     * @return a ResultInfo containing user data or error.
     */
    @PostMapping ("/login")
    @ResponseBody
    public ResultInfo userLogin(final String userName, final String userPwd) {

        // Create a new ResultInfo object to hold the login result.
        ResultInfo resultInfo = new ResultInfo();

        // Attempt to log in the user with the provided credentials.
        // If successful, this will return the corresponding user model.
        UserModel userModel = userService.userLogin(userName, userPwd);

        // Set the user model to the result of the ResultInfo object.
        // This will be sent back to the client as a response.
        resultInfo.setResult(userModel);

        // Return the ResultInfo object containing the user data
        // or any potential errors.
        return resultInfo;
    }

    /**
     * Updates the password of a user.
     * @param request The HttpServletRequest object,
     *                providing information about the request.
     * @param oldPassword the old password.
     * @param newPassword the new password.
     * @param repeatPassword repeated new password.
     * @return a ResultInfo confirming password update.
     */
    @PostMapping("/updatePwd")
    @ResponseBody
    public ResultInfo updateUserPassword(final HttpServletRequest request,
                                         final String oldPassword,
                                         final String newPassword,
                                         final String repeatPassword) {

        // Create a new ResultInfo object to hold the update password result.
        ResultInfo resultInfo = new ResultInfo();

        Integer userId = LoginUserUtil.releaseUserIdFromCookie(request);
        // Invoke the userService to update the user's password.
        // This will validate the old password, compare the new password
        // with the repeated one, and then update it if all checks pass.
        userService.updatePassWord(userId,
                                   oldPassword,
                                   newPassword,
                                   repeatPassword);

        // Return the ResultInfo object containing any potential errors
        // or a success message (which set inside the userService method).
        return resultInfo;
    }

    /**
     * Gets a list of users based on given parameters.
     * @param userQuery the query parameters.
     * @return a Map containing user list data.
     */
    @RequestMapping("/list")
    @ResponseBody
    public Map<String, Object> selectByParams(final UserQuery userQuery) {
        // Call the userService to query user data based on the userQuery
        return userService.queryByParamsForTable(userQuery);
    }

    /**
     * Adds a new user.
     * @param user the User object containing user details.
     * @return a ResultInfo confirming user addition.
     */
    @PostMapping("/add")
    @ResponseBody
    public ResultInfo addUser(final User user) {
        // Call the userService to add the new user
        // using the provided user object
        userService.addUser(user);
        // Return a success message indicating
        // that the user was added successfully
        return success("User added successfully!");
    }

    /**
     * Updates user details.
     * @param user the User object containing updated user details.
     * @return a ResultInfo confirming user update.
     */
    @PostMapping("/update")
    @ResponseBody
    public ResultInfo updateUser(final User user) {
        // Call the userService to update the user details
        // using the provided user object
        userService.updateUser(user);
        // Return a success message indicating that the user
        // records were updated successfully
        return success("User records updated successfully!");
    }

    /**
     * Deletes users based on given IDs.
     * @param ids array of user IDs.
     * @return a ResultInfo confirming user deletion.
     */
    @PostMapping("/delete")
    @ResponseBody
    public ResultInfo deleteUser(final Integer[] ids) {
        // Call the userService to delete users
        // based on the provided array of user IDs
        userService.deleteByIds(ids);
        // Return a success message indicating
        // that the users were deleted successfully
        return success("User deleted successfully!");
    }
    /**
     * Redirects to the password management page.
     * This method handles the navigation to the page
     * where users can manage their passwords.
     * @return The name of the password management view.
     */
    @RequestMapping("toPasswordPage")
    public String toPasswordPage() {
        return "user/password";
    }
    /**
     * Displays the main user page.
     * This method returns the view name of
     * the main user management page,
     * where various user-related operations can be performed.
     * @return The name of the main user view.
     */
    @RequestMapping("/index")
    public String index() {
        return "user/user";
    }
    /**
     * Navigates to the page for adding or updating a user.
     * This method directs to a view for
     * adding a new user or updating an existing one.
     * If an ID is provided, it fetches the corresponding
     * user details and sets them as a request attribute.
     *
     * @param id The ID of the user to be updated, or null if adding a new user.
     * @param request The HttpServletRequest object,
     *               providing information about the request.
     * @return The name of the add or update user view.
     */
    @RequestMapping("toAddOrUpdateUserPage")
    public String toAddOrUpdateUserPage(final Integer id,
                                        final HttpServletRequest request) {
        if (id != null) {
            User user = userService.selectByPrimaryKey(id);
            request.setAttribute("userInfo", user);
        }
        return "user/add_update";
    }
}
