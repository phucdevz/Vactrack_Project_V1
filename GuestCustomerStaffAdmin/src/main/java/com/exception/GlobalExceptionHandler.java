package main.java.com.exception;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ModelAndView handleResourceNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView("error/404");
        modelAndView.addObject("timestamp", new Date());
        modelAndView.addObject("message", ex.getMessage());
        modelAndView.addObject("path", request.getRequestURL());
        return modelAndView;
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ModelAndView handleNoHandlerFoundException(NoHandlerFoundException ex, HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView("error/404");
        modelAndView.addObject("timestamp", new Date());
        modelAndView.addObject("message", "Trang bạn yêu cầu không tồn tại");
        modelAndView.addObject("path", request.getRequestURL());
        return modelAndView;
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ModelAndView handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView("error/403");
        modelAndView.addObject("timestamp", new Date());
        modelAndView.addObject("message", "Bạn không có quyền truy cập trang này");
        modelAndView.addObject("path", request.getRequestURL());
        return modelAndView;
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ModelAndView handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView("error/400");
        modelAndView.addObject("timestamp", new Date());
        modelAndView.addObject("message", ex.getMessage());
        modelAndView.addObject("path", request.getRequestURL());
        return modelAndView;
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ModelAndView handleGlobalException(Exception ex, HttpServletRequest request) {
        ModelAndView modelAndView = new ModelAndView("error/500");
        modelAndView.addObject("timestamp", new Date());
        modelAndView.addObject("message", "Đã xảy ra lỗi: " + ex.getMessage());
        modelAndView.addObject("path", request.getRequestURL());
        return modelAndView;
    }
}
