// User.java
package main.java.com.entity;

import lombok.Data;
import javax.persistence.*;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String fullName;
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean emailNotificationsEnabled = true;
    private boolean smsNotificationsEnabled = false;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Child> children;

    // Constructors, additional getters/setters if needed
}

// Role.java (Enum)
package java.com.entity;

public enum Role {
    ADMIN, STAFF, PARENT
}
