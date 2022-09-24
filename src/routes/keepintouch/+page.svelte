<script lang="ts">
</script>



<div class="flex min-h-screen ">

    <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-22 mb-32 self-center min-w-full"> <!-- generalize! -->

        <center>
        <div class="break-words">
            <p class="break-words sm:text-md md:text-xl m-auto pt-10 p-2 mt-10">
            
                Do you want to <b>collaborate</b> with us? <br />
                Do you want to <b>share</b> some brilliant ideas? <br />
                Do you want to get some <b>reading tips</b>? <br />

                <br />

                We are looking forward to hearing from you! 
            
            </p>
        </div>
        </center>
        
        <form class="container-form w-4/5 xl:w-3/5 m-auto mt-10 text-sm">
            <input type="text" id="fname" name="fname" placeholder="Name and surname*" required><br>
            <input type="text" id="fobject" name="fobject" placeholder="Object*" required><br>
            <input type="text" id="femail" name="femail" placeholder="Email*" required><br>
            <input type="textarea" id="ftext" name="ftext" placeholder="Text*" class="overflow-scroll self-start" required><br>
            <input type="submit" value="Send">
        </form>

    </div>

</div>


